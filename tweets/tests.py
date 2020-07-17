from django.test import TestCase
from rest_framework.test import APIClient

from .models import Tweet
from django.contrib.auth import get_user_model

# Create your tests here.
User = get_user_model()


class TweetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='abc', password='password')
        self.user1 = User.objects.create_superuser(username='abcd', password='password')
        tweet = Tweet.objects.create(content="MY C", user=self.user)
        tweet = Tweet.objects.create(content="MY B", user=self.user)
        tweet = Tweet.objects.create(content="MY D", user=self.user1)

    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='password')
        response = client.get('/tweets/')
        return client

    def test_tweet_list(self):
        client = self.get_client()
        response = client.get('/api/tweets/')
        self.assertEqual(response.status_code, 200)

    def test_action_tweet(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/",
                               {"id": 2, "action": "like"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        new_tweet_id = data.get("likes")
        self.assertEqual(new_tweet_id, 1)
        response = client.post("/api/tweets/action/",
                               {"id": 2, "action": "unlike"})
        data = response.json()
        new_tweet_id = data.get("likes")
        self.assertEqual(new_tweet_id, None)

        response = client.post("/api/tweets/create/",
                               {"content":"This is mah content"})
        data = response.json()
        new_tweet_id = data.get("id")
        self.assertEqual(new_tweet_id, 4)

        response = client.get("/api/tweets/1/",
                               {"content": "This is mah content"})
        data = response.json()
        new_tweet_id = data.get("id")
        self.assertEqual(new_tweet_id, 1)

        response = client.delete("/api/tweets/1/delete/",
                              {"content": "This is mah content"})
        self.assertEqual(response.status_code, 200)
        response = client.delete("/api/tweets/3/delete/",
                                 {"content": "This is mah content"})
        self.assertEqual(response.status_code, 401)

