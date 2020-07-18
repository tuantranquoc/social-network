import base64

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db.models import Q, Count
from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from profiles.models import Profile
from profiles.serializers import ProfileSerializer, PublicProfileSerializer
from ..models import Tweet, Comment, Community, HashTag
from ..serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer, CommentSerializer, \
    CommunitySerializer, HashTagSerializer

ALLOWED_HOST = settings.ALLOWED_HOSTS
User = get_user_model()


# Create your views here.

# *args list of value, **kwargs list of key : value
def local_tweets_profile_view(request, username, *args, **kwargs):
    return render(request, "tweet/profile.html", context={"profile_username": username})


# REST API courses
# find all tweet has been retweet:
@api_view(['GET'])
def tweet_parent_list_view(request, tweet_id, *args, **kwargs):
    if request.user.is_authenticated:
        tweet = Tweet.objects.filter(id=tweet_id).first()
        tweet = Tweet.objects.filter(parent=tweet)

        if not tweet:
            return Response({}, status=204)
        serializer = TweetSerializer(tweet, many=True)
        return Response(serializer.data, status=200)


@api_view(['GET'])
def comment_parent_list_view(request, comment_id, *args, **kwargs):
    if request.user.is_authenticated:
        comment = Comment.objects.filter(id=comment_id).first()
        comment = Comment.objects.filter(parent=comment)

        if not comment:
            return Response({}, status=204)
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data, status=200)


@api_view(['POST'])
def child_comment_create_view(request, comment_id, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    """
    data = {"content":"CONTENT"}
    """
    if request.user.is_authenticated:
        comment = Comment.objects.filter(id=comment_id).first()

        if not comment:
            return Response({}, status=204)
        content = request.data.get("content")
        comment = Comment.objects.create(parent=comment, content=content, user=request.user)
        if comment:
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=201)
        return Response({"detail", "Bad Request"}, status=400)


@api_view(['POST'])  # http method client has send == POST
def comment_create_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        content = request.data.get("content")
        tweet_id = request.data.get("id")

        if content and tweet_id:
            tweet = Tweet.objects.get(id=tweet_id)
            comment = Comment.objects.create(user=request.user, tweet=tweet, content=content)
            comment = Comment.objects.filter(id=comment.id)
            serializer = CommentSerializer(comment, many=True)
            return Response(serializer.data, status=201)
    else:
        return Response({"detail": "Authentication credentials are not provided"}, status=403)


@api_view(['GET'])  # http method client has send == POST
def comment_api_view(request, tweet_id, *args, **kwargs):
    if request.user.is_authenticated:
        # Comment.objects.create(user_id=1, tweet=tweet, content="okay")

        # comment = Comment.objects.filter(tweet=tweet, user_id=1)
        comment = Comment.objects.filter(tweet_id=tweet_id)

        if not comment:
            return Response({}, status=204)
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data, status=200)
    else:
        return HttpResponse(" not OKE1")


@api_view(['POST'])  # http method client has send == POST
def tweet_create_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        serializer = TweetCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # still have null
            serializer.save(user=request.user)
            tweet_id = serializer.data.get('id')
            communities = request.data.get('community')
            hash_tag = request.data.get('hash_tag')
            image = request.data.get('image')

            if communities:
                tweet = Tweet.objects.filter(id=tweet_id).first()
                for community in communities:
                    community = Community.objects.filter(community_type=community).first()
                    community.tweet.add(tweet)
            if hash_tag:
                hash_tag_create(request.user, tweet_id, spilt_hash_tag(hash_tag))
            tweet = Tweet.objects.filter(id=tweet_id).first()
            if len(image) > len('data:,'):
                format, imgstr = image.split(';base64,')
                ext = format.split('/')[-1]
                image = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
                tweet.image = image
                tweet.save()
                tweet_serializer = TweetSerializer(tweet)
                return Response(tweet_serializer.data, status=201)
            tweet_serializer = TweetSerializer(tweet)
            return Response(tweet_serializer.data, status=201)

    else:
        return Response({"detail": "Authentication credentials are not provided"}, status=403)
    return Response({}, status=400)


@api_view(['POST'])
def tweet_image_create_view(request, tweet_id, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        if request.FILES:
            if request.FILES['img']:
                image = request.FILES['img']

                tweet = Tweet.objects.filter(id=tweet_id).first()
                tweet.image = image
                tweet.save()
                serializer = TweetSerializer(tweet)
                return Response(serializer.data, 200)
        else:
            return Response({}, 400)
    return Response({}, 403)


@permission_classes([IsAuthenticated])
@api_view(['POST'])  # http method client has send == POST
def tweet_create_view_django_user(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)

        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    query = Tweet.objects.all()

    username = request.user

    return get_paginated_queryset_response(query, request)


@api_view(('GET',))
def search(request, key_item, *args, **kwargs):
    items = Tweet.objects.filter(content=key_item)
    serializer = TweetSerializer(items, many=True)

    return get_paginated_queryset_response(items, request)


def get_paginated_queryset_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


def get_paginated_user_queryset_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = PublicProfileSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tweet_feed_view(request, *args, **kwargs):
    user = request.user

    tweets = Tweet.objects.filter(user=user)

    qs = Tweet.objects.feed(user)

    return get_paginated_queryset_response(qs, request)


@api_view(['GET'])
def tweet_details_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=200)


@permission_classes([IsAuthenticated])
@api_view(['DELETE', 'POST'])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({"message": "You can not delete this tweet"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message": "tweet removed"}, status=200)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def tweet_action_view(request, *args, **kwargs):
    """
    id is required
    action options are: like, unlike, re_tweet
    """
    if isinstance(request.user, User):

        serializer = TweetActionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = serializer.validated_data
            tweet_id = data.get("id")
            action = data.get("action")
            content = data.get("content")
            qs = Tweet.objects.filter(id=tweet_id)
            if not qs.exists():
                return Response({}, status=404)
            obj = qs.first()
            obj.likes.add(request.user)
            if action == "like":
                obj.likes.add(request.user)
                serializer = TweetSerializer(obj)
                return Response(serializer.data, status=200)
            elif action == "unlike":
                obj.likes.remove(request.user)
                serializer = TweetSerializer(obj)
                return Response(serializer.data, status=200)
            elif action == "retweet":
                # this is todo
                # no user nen like tu tang len 1 lol
                new_tweet = Tweet.objects.create(user=request.user, parent=obj, content=content)
                serializer = TweetSerializer(new_tweet)
                print("retweet",serializer.data)
                return Response(serializer.data, status=201)
            return Response({}, status=200)
    else:
        return Response({"detail": "Authentication credentials are not provided"}, status=403)


# Community part

@api_view(['GET', 'POST'])
def community_create_view(request, name, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_staff:
        if not Community.objects.filter(community_type=name) and Community.objects.create(community_type=name):
            return Response({}, status=200)
        return Response({}, status=400)
    else:
        return Response({}, 403)


@api_view(['GET', 'POST'])
def community_list_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        communities = Community.objects.all()
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data, status=200)
    else:
        return HttpResponse({}, 403)


@api_view(['POST'])
def community_tweet_create(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    """
    ; create tweet with community set in data post
    """
    if request.user.is_authenticated:

        tweet_id = request.data.get('id')
        communities = request.data.get('community')
        if tweet_id and communities:
            tweet = Tweet.objects.filter(id=tweet_id).first()
            for community in communities:
                community = Community.objects.filter(community_type=community).first()
                community.tweet.add(tweet)
            community = Community.objects.filter(community_type__in=communities)
            serializer = CommunitySerializer(community, many=True)
            return Response(serializer.data, status=200)
        else:
            return Response({}, status=400)
    else:
        return HttpResponse({}, status=403)


@api_view(['POST'])
def communities_tweet_create(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    """
    ; create tweet with community set in data post
    """
    if request.user.is_authenticated:
        tweet_id = request.data.get('id')
        communities = request.data.get('community')
        if tweet_id and communities:

            tweet = Tweet.objects.filter(id=tweet_id).first()
            for community in communities:
                community = Community.objects.filter(community_type=community).first()
                community.tweet.add(tweet)
            community = Community.objects.filter(community_type__in=communities)
            serializer = CommunitySerializer(community, many=True)
            return Response(serializer.data, status=200)
        else:
            return Response({}, status=400)
    else:
        return HttpResponse({}, status=403)


@api_view(['GET'])
def tweet_by_community_view(request, community_type, *args, **kwargs):
    if request.user.is_authenticated:
        if community_type:
            community = Community.objects.filter(community_type=community_type).first()
            tweets = Tweet.objects.filter(community=community).order_by("-likes")
            return get_paginated_queryset_response(tweets, request)
        return Response({}, status=400)
    else:
        return Response({}, status=403)


@api_view(['GET'])
def hash_tag_views(request, *args, **kwargs):
    hash_tag = HashTag.objects.annotate(count=Count("user")).order_by("-count")
    serializer = HashTagSerializer(hash_tag, many=True)
    return Response(serializer.data, status=200)


@api_view(['POST'])
def hash_tag_create_views(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        hash_tag = request.data.get("hash_tag")
        tweet_id = request.data.get("id")
        tweet = Tweet.objects.filter(id=tweet_id).first()
        check_hash_tag = HashTag.objects.filter(hash_tag=hash_tag).first()
        if not check_hash_tag:
            hash_tag = HashTag.objects.create(hash_tag=hash_tag)
            hash_tag.tweet.add(tweet)
            hash_tag.user.add(request.user)
            hash_tag.save()
            serializer = HashTagSerializer(hash_tag)
            return Response(serializer.data, status=200)
        else:
            if tweet not in check_hash_tag.tweet.all():
                check_hash_tag.tweet.add(tweet)
            if request.user not in check_hash_tag.user.all():
                check_hash_tag.user.add(request.user)
            serializer = HashTagSerializer(check_hash_tag)
            return Response(serializer.data, status=200)


def hash_tag_create(user, tweet_id, hash_tag_list):
    if not request.user:
        return redirect("/login/")
    tweet = Tweet.objects.filter(id=tweet_id).first()
    for hash_tag in hash_tag_list:
        check_hash_tag = HashTag.objects.filter(hash_tag=hash_tag).first()
        if not check_hash_tag:
            hash_tag = HashTag.objects.create(hash_tag=hash_tag)
            hash_tag.tweet.add(tweet)
            hash_tag.user.add(user)
            hash_tag.save()
        else:
            if tweet not in check_hash_tag.tweet.all():
                check_hash_tag.tweet.add(tweet)
            if user not in check_hash_tag.user.all():
                check_hash_tag.user.add(user)


def spilt_hash_tag(hash_tag):
    if "#" in hash_tag:
        hash_tag_list = hash_tag.split("#")
        hash_tag_list.pop(0)

        return hash_tag_list
    return hash_tag


def spilt_user_tag(hash_tag):
    if "@" in hash_tag:
        hash_tag_list = hash_tag.split("@")
        hash_tag_list.pop(0)
        return hash_tag_list
    return hash_tag


def hash_tag_search(request, *args, **kwargs):
    if request.user.is_authenticated:
        hash_tag = request.POST["hash_tag"]
        if hash_tag:
            hash_tag = spilt_hash_tag(hash_tag)
            hash_tag = HashTag.objects.filter(hash_tag__in=hash_tag).first()
            if request.user not in hash_tag.user.all():
                hash_tag.user.add(request.user)
            return render(request, "pages/feed.html", context={})
    return render(request, "tweet/list.html", context={})


# hash_tag = request.POST["hash_tag"]
@api_view(['POST'])
def hash_tag_search_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        hash_tag = request.data.get("hash_tag")

        if hash_tag:
            detect = False
            if '@' in hash_tag:

                tags = spilt_user_tag(hash_tag)
                users = User.objects.filter(username__in=tags)
                profiles = Profile.objects.filter(user__username__in=tags)
                return get_paginated_user_queryset_response(profiles, request)
            if '#' in hash_tag:
                hash_tag = spilt_hash_tag(hash_tag)

                _hash_tag = HashTag.objects.first()
                if type(hash_tag) == str:
                    _hash_tag = HashTag.objects.filter(hash_tag=hash_tag).first()
                if type(hash_tag) == list:
                    _hash_tag = HashTag.objects.filter(hash_tag__in=hash_tag)
                    for h in _hash_tag:
                        if request.user not in h.user.all():
                            h.user.add(request.user)
                    detect = True

                if detect:
                    tweet = Tweet.objects.filter(hashtag__in=_hash_tag)
                else:
                    tweet = Tweet.objects.filter(hashtag=_hash_tag)
                if tweet:
                    return get_paginated_queryset_response(tweet, request)
                return Response({"detail": "not found"}, status=204)

    return Response({}, status=400)


def get_paginated_queryset_hash_tag_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 3
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = HashTagSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def top_hash_tag(request, *args, **kwargs):
    #  hash_tag = HashTag.objects.all().order_by("-search_count")[:10]
    _hash_tag = HashTag.objects.annotate(
        user_count=Count("user")
    ).order_by(
        "-user_count"
    )

    return get_paginated_queryset_hash_tag_response(_hash_tag, request)
