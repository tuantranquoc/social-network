import json

import requests
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response

from tweet_v0 import settings

User = get_user_model()


# Function based views to Class based views
# Create your views here.
def login_view(request, *args, **kwargs):
    # form = MyModelForm(request.POST or NONE)
    if isinstance(request.user, User):
        return redirect("/")
    form = AuthenticationForm(request, data=request.POST or None)
    if form.is_valid():
        # username = form.cleaned_data.get("username")
        # user = authenticate(username, password);
        user_ = form.get_user()

        res = request.POST["g-recaptcha-response"]
        secretKey = settings.GOOGLE_RECAPTCHA_SECRET_KEY
        data = {
            "secret": secretKey,
            "response": res
        }
        r = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        response = json.loads(r.text)
        ve = response["success"]
        if not ve:
            context = {
                "form": form,
                "btn_label": "Login",
                "title": "Login",
                "register": "Create a new account?",
                "type": "Login",
                "message": "Invalid captcha"
            }
            print("message", type(ve))
            return render(request, "accounts/auth.html", context)

        login(request, user_)
        return redirect("/")
    context = {
        "form": form,
        "btn_label": "Login",
        "title": "Login",
        "register": "Create a new account?",
        "type": "Login"
    }
    return render(request, "accounts/auth.html", context)


def logout_view(request, *args, **kwargs):
    # form = MyModelForm(request.POST or NONE)
    if request.method == 'POST':
        logout(request)
        return redirect("/login")
    # if request.method == 'GET':
    #     logout(request)
    #     return redirect("/login")
    context = {
        "form": None,
        "description": "Are you sure want to logout?",
        "btn_label": "Click to confirm?",
        "title": "Logout"}
    return render(request, "accounts/auth.html", context)


@api_view(['GET', 'POST'])
def logout_view_js(request, *args, **kwargs):
    # form = MyModelForm(request.POST or NONE)
    if request.method == 'POST':
        logout(request)
        return Response({}, status=200)
    if request.method == 'GET':
        logout(request)
        return Response({}, status=200)
    return Response({}, status=400)


def register_view(request, *args, **kwargs):
    # form = MyModelForm(request.POST or NONE)
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        # username = form.cleaned_data.get("username")
        # user = authenticate(username, password);
        user_ = form.save(commit=True)
        # set_password for user model
        user_.set_password(form.cleaned_data.get("password1"))
        print(form.cleaned_data)
        login(request, user_)
        return redirect("/")
    context = {"form": form, "btn_label": "Register", "title": "Register"}
    return render(request, "accounts/auth.html", context)


@api_view(['GET', 'POST'])
def login_via_react_view(request, *args, **kwargs):
    username = request.data.get("username")
    password = request.data.get("password")
    print("login", username, password)
    user = authenticate(username=username, password=password)
    print("user",user)
    if user:
        login(request, user)
        return Response({}, status=200)
    return Response({}, status=404)


@api_view(['GET', 'POST'])
def register_via_react_view(request, *args, **kwargs):
    print("method", request.method)
    username = request.data.get("username")
    password = request.data.get("password")
    print("register-", username, password)
    if username and password:
        user = User.objects.create_user(username=username, password=password)
        if user:
            login(request, user)
        if not user:
            return Response({}, status=400)
    return Response({}, status=200)
