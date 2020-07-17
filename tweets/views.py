import json

import requests
from django.contrib import messages
from django.db.models import Count
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.utils.http import is_safe_url
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Tweet, HashTag
from .forms import TweetForm
from tweet_v0 import firebase
from .serializers import HashTagSerializer

ALLOWED_HOST = settings.ALLOWED_HOSTS
User = get_user_model()


# Create your views here.
def test_page(request, *args, **kwargs):
    return render(request, "react_via_dj.html", status=200)


def home_page(request, *args, **kwargs):
    return render(request, "pages/feed.html", context={"hash_tag": top_hash_tag()}, status=200)


def tweets_list_view(request, *args, **kwargs):
    return render(request, "tweet/list.html", context={"hash_tag": top_hash_tag()})


def tweets_detail_view(request, tweet_id, *args, **kwargs):
    return render(request, "tweet/detail.html", context={"tweet_id": tweet_id, "hash_tag": top_hash_tag()})


def tweet_community_view(request, community_type, *args, **kwargs):
    return render(request, "pages/community.html", context={"community": community_type, "hash_tag": top_hash_tag()})


def tweets_hash_tag_view(request, *args, **kwargs):
    hash_tag = request.POST["hash_tag"]
    print("hash-t", hash_tag)
    return render(request, "tweet/hash_tag.html", context={"hash_tag": hash_tag})


def tweets_hash_tag_view_get(request, *args, **kwargs):
    hash_tag = "#hi"
    print("mt", request.method)
    if request.method == "POST":
        data = request.json()
        hash_tag = data["hash_tag"]
        # hash_tag = request.data.get("hash_tag")
        print(hash_tag)
    print(hash_tag)
    return render(request, "tweet/hash_tag.html", context={"hash_tag": hash_tag})


def split_hash_tag(hash_tag):
    if "-" in hash_tag:
        hash_tag_list = hash_tag.split("-")
        print("hash-ls", hash_tag_list)
        return hash_tag_list
    return hash_tag


def replace_to(hash_tag):
    if hash_tag[0] != '-':
        hash_tag = '-' + hash_tag
    if "-" in hash_tag:
        hash_tag_list = hash_tag.replace("-", "#")
        print("hash-rp", hash_tag_list)
        return hash_tag_list
    return hash_tag


def tweets_hash_tag_url_view(request, hash_tag_url, *args, **kwargs):
    hash_tag = ""
    if hash_tag_url:
        print("hash-t-url",hash_tag_url)
        #hash_tag = split_hash_tag(hash_tag_url)
        hash_tag = replace_to(hash_tag_url)
    print("tags", hash_tag)
    print("tags-url", hash_tag_url)
    return render(request, "tweet/hash_tag.html", context={"hash_tag": hash_tag})


def tweets_top_hash_tag(request, *args, **kwargs):
    _hash_tag = HashTag.objects.annotate(
        user_count=Count("user")
    ).order_by(
        "-user_count"
    )
    serializer = HashTagSerializer(_hash_tag, many=True)
    print(serializer.data)

    return render(request, "tweet/list.html", context={"hash_tag": serializer.data})


def top_hash_tag():
    _hash_tag = HashTag.objects.annotate(
        user_count=Count("user")
    ).order_by(
        "-user_count"
    )
    serializer = HashTagSerializer(_hash_tag, many=True)
    return serializer.data


def send_data_firebase(request):
    firebase.send_to_firebase("s")
    return HttpResponse("", status=200)


def read_data_firebase(request):
    firebase.read_from_firebase()
    return HttpResponse("", status=200)
