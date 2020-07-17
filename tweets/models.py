from django.db import models
from django.conf import settings
import random
from django.core.signals import request_finished
from django.db.models import Q

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.urls import reverse
from .validators import validate_min_length

User = settings.AUTH_USER_MODEL


# Create your models here.
class TestUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=30, blank=True)
    password = models.CharField(max_length=30, blank=True)


class TweetQuerySet(models.QuerySet):

    def by_username(self, username):
        return self.filter(user__username__iexact=username)

    # This function not return an profile that not have following in there profile
    def feed(self, user):
        profiles = user.following.exists()
        if profiles:
            print("ex")
            # option add user's feed or not  follower_id = user.following.values_list("user__id", flat=True) =>
            # haven't have user' feed
            follower_id = user.following.values_list("user__id", flat=True)
            print(follower_id)
            return self.filter(
                Q(user__id__in=follower_id) | Q(user=user)).distinct().order_by("-timestamp")  # Replace model.objects
        else:
            return self.filter(Q(user=user)).distinct().order_by("-timestamp")


class TweetManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return TweetQuerySet(self.model, using=self._db)

    def feed(self, user):
        return self.get_queryset().feed(user)


class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets")
    content = models.TextField(blank=True, null=True)
    likes = models.ManyToManyField(User, related_name="tweet_user")
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = TweetManager()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.content or "@!$"

    def __time__(self):
        return self.timestamp

    def __like__(self):
        return self.likes.count()

    @property
    def is_retweet(self):
        return self.parent is not None

    def serialize(self):
        """
        free to delete
        """
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 122)
        }


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.content or "@!$"


class Community(models.Model):
    community_type = models.CharField(max_length=255, blank=True, null=True)
    tweet = models.ManyToManyField(Tweet, blank=True)

    def __str__(self):
        return self.community_type

    def __count__(self):
        return self.tweet.count()


class HashTag(models.Model):
    hash_tag = models.CharField(max_length=255, blank=True, validators=[validate_min_length])
    user = models.ManyToManyField(User, blank=True)
    tweet = models.ManyToManyField(Tweet, blank=True)

    def __str__(self):
        return self.hash_tag

    def __count__(self):
        return self.user.count()

# pre = truoc khi luu
# pos = sau khi luu
