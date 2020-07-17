from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import Http404
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Profile
from ..serializers import PublicProfileSerializer

import base64
from django.core.files.base import ContentFile

ALLOWED_HOST = settings.ALLOWED_HOSTS
User = get_user_model()


# Create your views here.


def local_tweets_profile_view(request, username, *args, **kwargs):
    print(username)
    return render(request, "tweet/profile.html", context={"profile_username": username})


def get_paginated_queryset_recommend_user_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = PublicProfileSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


# REST API courses
# @api_view(['GET'])  # http method client has send == POST
# @permission_classes([IsAuthenticated])
# def user_follow_view(request, *args, **kwargs):
#    current_user = request.user
#    return Response({},status=200)


# @api_view(['GET', 'POST'])  # http method client has send == POST
# @permission_classes([IsAuthenticated])
# def user_follow_view(request, username, *args, **kwargs):
#     me = request.user
#     if me.username == username:
#         my_followers = me.profile.follower.all()
#         return Response({"count": my_followers.count()}, status=200)
#     other_user_qs = User.objects.filter(username=username)
#     if not other_user_qs:
#         return Response({}, status=404)
#     other = other_user_qs.first()
#     profile = other.profile
#
#     data = request.data or {}
#     print(data)
#     action = data.get("action")
#     if action == "follow":
#         profile.follower.add(me)
#     elif action == "unfollow":
#         profile.follower.remove(me)
#     else:
#         pass
#     data = PublicProfileSerializer(instance=profile, context={"request": request})
#     print(data.data)
#     return Response(data.data, status=200)


@api_view(['GET', 'POST'])
def profile_detail_api_view(request, username, *args, **kwargs):
    # get the profile for the pass user name
    print("user: ", request.user)
    print("target:", username)
    qs = Profile.objects.filter(user__username=username)
    print(qs)
    if not qs.exists():
        return Response({"detail": "User not found"}, status=404)
    profile_obj = qs.first()

    serializer = PublicProfileSerializer(instance=profile_obj, context={"request": request})

    data = request.data or {}
    print(data)
    if request.method == "POST":
        me = request.user
        action = data.get("action")
        if profile_obj.user != me:
            if action == "follow":
                profile_obj.follower.add(me)
            elif action == "unfollow":
                profile_obj.follower.remove(me)
            else:
                pass
    return Response(serializer.data, status=200)


@api_view(['GET', 'POST'])
def profile_image_post(request, *args, **kwargs):
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user=request.user)
        if request.FILES:
            image = request.FILES['img']
            profile = profile.first()
            print(type(image))
            # profile.background = image
            print("past background", profile.background)
            profile.background = image
            profile.save()
            print("current", profile.background)
            return Response({}, status=200)
        else:
            return Response({}, status=400)
    else:
        return Response({}, status=401)


@api_view(['GET', 'POST'])
def profile_avatar_post(request, *args, **kwargs):
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user=request.user).first()
        if request.data.get("img"):
            data = request.data.get("img")
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]

            image = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            # profile.background = image
            print("past background", profile.avatar)
            profile.avatar = image
            profile.save()
            print("current", profile.avatar)
            return Response({}, status=200)
        else:
            return Response({}, status=400)
    else:
        return Response({}, status=401)


@api_view(['GET', 'POST'])
def profile_background_post(request, *args, **kwargs):
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user=request.user).first()
        if request.data.get("img"):
            data = request.data.get("img")
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]

            image = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            # profile.background = image
            print("past background", profile.background)
            profile.background = image
            profile.save()
            print("current", profile.background)
            return Response({}, status=200)
        else:
            return Response({}, status=400)
    else:
        return Response({}, status=401)


@api_view(['GET'])
def get_following_profiles(request, username, *args, **kwargs):
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user__username=username).first()
        print(profile)
        if profile:
            following = profile.user.following.all()
            return get_paginated_queryset_recommend_user_response(following, request)
        return Response({}, status=400)
    return Response({}, status=403)


@api_view(['GET'])
def get_follower_profiles(request, username, *args, **kwargs):
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user__username=username).first()
        print(profile)
        if profile:
            follower = profile.follower.all()
            profiles = Profile.objects.filter(user__in=follower)
            print("follower-", profiles)
            return get_paginated_queryset_recommend_user_response(profiles, request)
        return Response({}, status=400)
    return Response({}, status=403)
