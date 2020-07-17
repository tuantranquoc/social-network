from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from tweets.models import Tweet
from .models import Profile

User = get_user_model()


class TestProfile(TestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='abc', password='password')
        self.user1 = User.objects.create_superuser(username='abcd', password='password')
        self.user2 = User.objects.create_superuser(username='abcdc', password='password')

    def test_profile_created_via_signal(self):
        profiles = Profile.objects.all()
        self.assertEqual(profiles.count(), 3)

    def test_profile_follower(self):
        profiles = Profile.objects.get(user=self.user)
        profiles.follower.add(self.user1)
        profiles.save()
        self.assertEqual(profiles.follower.count(), 1)

    def test_profile_following(self):
        first = self.user
        second = self.user1
        third = self.user2
        first_profile = first.profile
        second_profile = second.profile
        third_profile = third.profile
        first_profile.follower.add(second)
        first_profile.follower.add(third)
        print(first_profile.follower.all())

        second_profile.follower.add(first)
        third_profile.follower.add(first)
        print(first.following.all())
        second_user_following_who = second.following.all()
        print("second", second_user_following_who)
        if second_user_following_who:
            followed_user_id = [x.user.id for x in second_user_following_who]
            followed_user_id.append(second.id)
            print(followed_user_id)
            print("user 2 following",Tweet.objects.filter(user__id__in=followed_user_id))

    def get_client(self):
        client = APIClient()
        client.login(username=self.user1.username, password='password')
        return client

    def test_tweet_list(self):
        client = self.get_client()
        action = 'follow'
        url = '/api/profile/' + self.user.username + '/' + action
        response = client.post(url,
                               {"action": "follow"})
        print(response.data)
        self.assertEqual(response.status_code, 200)
