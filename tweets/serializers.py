from abc import ABC
from profiles.serializers import PublicProfileSerializer, ProfileSerializer
from rest_framework import serializers
from django.core import serializers as sers
from django.contrib.auth import get_user_model
from tweet_v0.settings import MAX_TWEET_LENGTH, TWEET_ACTION
from .models import Tweet, Comment, Community, HashTag
import random

User = get_user_model()


class TweetCreateSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source='user.profile', read_only=True)

    class Meta:
        model = Tweet
        fields = ['user', 'id', 'content', 'timestamp']

    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long!")
        return value


class TweetSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source='user.profile', read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    community = serializers.SerializerMethodField(read_only=True)
    hash_tag = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['user',
                  'id',
                  'content',
                  'likes',
                  'is_retweet',
                  'parent',
                  'timestamp',
                  'community', 'hash_tag','image','timestamp']

    def get_likes(self, obj):
        return obj.likes.count()

    def get_community(self, obj):
        community = Community.objects.filter(tweet=obj)
        serializer = CommunitySerializer(community, many=True)
        return serializer.data

    def get_hash_tag(self, obj):
        hash_tag = HashTag.objects.filter(tweet=obj)
        serializer = HashTagSerializer(hash_tag, many=True)
        return serializer.data


class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTION:
            raise serializers.ValidationError("This is not an valid action for tweets")
        return value


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    random = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        # ['content']
        fields = ['content', 'username', 'tweet', 'id', 'random']

    def get_username(self, obj):
        return obj.user.username

    def get_random(self, obj):
        return random.randint(0, 10)


class CommentCreateSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source='user.profile', read_only=True)
    tweet = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = '__all__'

    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long!")
        return value


class CommunitySerializer(serializers.ModelSerializer):
    #   count = serializers.SerializerMethodField(read_only=True)
    communities = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Community
        fields = ['communities']

    def get_count(self, obj):
        return obj.tweet.count()

    def get_communities(self, obj):
        data = obj.community_type
        return data


def search(obj):
    return obj.user.count()


class HashTagSerializer(serializers.ModelSerializer):
    search_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = HashTag
        fields = ['hash_tag', 'search_count']

    def get_search_count(self, obj):
        return obj.user.count()
