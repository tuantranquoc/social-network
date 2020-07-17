from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookmark.models import Bookmark
from tweets.models import Tweet
from tweets.serializers import TweetSerializer

User = get_user_model()


@api_view(['POST'])
def bookmark_create_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        tweet_id = request.data.get("id")
        if tweet_id:
            tweet = Tweet.objects.filter(id=tweet_id).first()
            bookmark = Bookmark.objects.filter(user=request.user).first()
            print(bookmark.tweet)
            if tweet in bookmark.tweet.all():
                bookmark.tweet.remove(tweet)
            else:
                bookmark.tweet.add(tweet)
            return Response({}, status=200)
        else:
            return Response({}, status=400)
    return Response({}, status=403)


@api_view(['GET'])
def bookmark_view(request, *args, **kwargs):
    if request.user.is_authenticated:

        bookmark = Bookmark.objects.filter(user=request.user).first()
        tweet = Tweet.objects.filter(bookmark=bookmark)
        serializer = TweetSerializer(tweet, many=True)

        return get_paginated_queryset_response(tweet, request)
    else:
        return Response({}, status=400)


def get_paginated_queryset_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)
