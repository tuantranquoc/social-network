from django.contrib.auth import get_user_model
from django.db.models import Count, Max
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from itertools import chain
from profiles.models import Profile
from profiles.serializers import PublicProfileSerializer

User = get_user_model()


def get_paginated_queryset_recommend_user_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 3
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = PublicProfileSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def recommend_user_from_profile(request, username, *args, **kwargs):
    """
    get list follower from this acc
    profile -> follower acc -> max follower count okay >?
    """
    if request.user.is_authenticated:
        user = request.user
        following = user.following.all()
        print(following)
        profile_user_following = User.objects.filter(username=username).first()
        profile_user_following = profile_user_following.following.all()
        print(profile_user_following)
        user_profile = Profile.objects.filter(user__profile__in=profile_user_following)
        u = user_profile.annotate(count=Count('follower')).order_by(
            "-count"
        )
        u = u.exclude(user__profile__in=following).exclude(user=request.user)
        return get_paginated_queryset_recommend_user_response(u, request)


@api_view(['GET'])
def recommend_user_from_feed(request, *args, **kwargs):
    """
    get all follower list from feed -> feed mean that all the tweet that user has follow
    get all the follower profile from em
    """
    if request.user.is_authenticated:
        user = request.user
        # profiles that this user follow
        profiles = user.following.all()

        _pr = Profile.objects.none()
        _pr1 = Profile.objects.none()

        # get their profiles to get following list
        pr = Profile.objects.filter(user__profile__in=profiles)

        for p in profiles:
            _pr = p.user.following.annotate(count=Count("follower")).exclude(user__profile__in=profiles).exclude(
                user=request.user).order_by("-count")

            _pr1 = _pr1 | _pr

        idss = set(_pr1)

        profile_list = Profile.objects.filter(user__profile__in=idss).annotate(count=Count("follower")).order_by(
            "-count")
        print(profile_list)
        return get_paginated_queryset_recommend_user_response(profile_list, request)
    return Response({}, status=400)


@api_view(['GET'])
def recommend_user_from_global(request, *args, **kwargs):
    if request.user.is_authenticated:
        user = request.user
        following = user.following.all()
        print("following user", following)
        profiles = Profile.objects.annotate(count=Count("follower")).exclude(user__profile__in=following).exclude(
            user=request.user).order_by("-count")

        print(profiles)
        return get_paginated_queryset_recommend_user_response(profiles, request)
    return Response({}, status=400)
