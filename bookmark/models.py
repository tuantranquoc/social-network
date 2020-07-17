from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.conf import settings

from tweets.models import Tweet

User = settings.AUTH_USER_MODEL


# Create your models here.

class Bookmark(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tweet = models.ManyToManyField(Tweet, blank=True)

    def __str__(self):
        return self.user.username


def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Bookmark.objects.get_or_create(user=instance)


post_save.connect(user_did_save, sender=User)
