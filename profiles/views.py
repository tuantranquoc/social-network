from django.shortcuts import render, redirect
from django.http import Http404, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .forms import ProfileForm, ProfileBasicForm
from .models import Profile

# Saving with commit=False gets you a model object, then you can add your extra data and save it.
from .serializers import PublicProfileSerializer


def profile_update_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if not request.user.is_authenticated:
        return redirect("/login")
    user = request.user
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }
    my_profile = user.profile
    form = ProfileForm(request.POST or None, instance=my_profile, initial=user_data)
    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get("first_name")
        last_name = form.cleaned_data.get("last_name")
        email = form.cleaned_data.get("email")
        user.first_name = first_name
        user.last_name = last_name
        user.email_address = email
        profile_obj.location = form.cleaned_data.get("location")
        profile_obj.bio = form.cleaned_data.get("bio")
        profile_obj.save()
        user.save()
    context = {
        "form": form,
        "btn_label": "save",
        "title": "Update Profile"
    }
    return render(request, "profiles/form.html", context)


# Create your views here.
def profile_detail_view(request, username, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    # get the profile for the pass user name
    print(username)
    qs = Profile.objects.filter(user__username=username)
    print(qs)
    if not qs.exists():
        raise Http404
    profile_obj = qs.first()
    is_following = False
    if request.user:
        if request.user.is_authenticated:
            user = request.user
            is_following = user in profile_obj.follower.all()
    context = {
        "title": "Profile",
        "profile_username": username,
        "profile": profile_obj,
        "is_following": is_following
    }
    return render(request, "profiles/detail.html", context)


@api_view(['GET'])
def profile_user_detail_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    # get the profile for the pass user name
    if request.user.is_authenticated:
        user = request.user
        return render(request, 'profiles/detail.html', {"profile_username": user})
    return redirect("/login")


def profile_following_view(request, username, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        print("username-following", username)
        return render(request, 'profiles/following.html', context={"profile_username": username})
    return render(request, 'tweet/list.html', context={"profile_username": username})


def profile_follower_view(request, username, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        print("username-following", username)
        return render(request, 'profiles/follower.html', context={"profile_username": username})
    return render(request, 'tweet/list.html', context={"profile_username": username})


@api_view(['GET', 'POST'])
def profile_update_via_react_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if not request.user.is_authenticated:
        return redirect("/login")
    user = request.user
    print("user", user)
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }
    my_profile = user.profile
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    location = request.data.get("location")
    bio = request.data.get("bio")
    email = request.data.get("email")
    print(first_name, last_name, location, bio, email)
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    my_profile.location = location
    my_profile.bio = bio
    user.save()
    my_profile.save()
    return Response({}, status=200)


def profile_update_view_page(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        return render(request, 'profiles/edit.html', context={"profile_username": request.user.username})
    return redirect("/login/")
