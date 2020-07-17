"""tweet_v0 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from tweets import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from bookmark.views import (
    bookmark_view
)
from accounts.views import (
    login_view, logout_view, register_view, register_via_react_view, login_via_react_view, logout_view_js
)

from chat.views import (
    chat_box_view, chat_box_search_view
)

from django.views.generic import TemplateView

urlpatterns = [
    # Views
    path('', views.home_page),
    path('firebase/', views.send_data_firebase),
    path('firebase/read', views.read_data_firebase),
    path('api/register/', register_via_react_view),
    path('api/login/', login_via_react_view),
    path('admin/', admin.site.urls),
    path('global/', views.tweets_list_view),
    path('community/<str:community_type>/', views.tweet_community_view),
    path('<int:tweet_id>', views.tweets_detail_view),
    path('bookmark/', bookmark_view),
    re_path(r'profiles?/', include('profiles.urls')),

    path('hash_tag/search', views.tweets_hash_tag_view),
    path('hash_tag/get/search', views.tweets_hash_tag_view_get),
    path('hash_tag/search/<str:hash_tag_url>', views.tweets_hash_tag_url_view),
    path('hash_tag/top/', views.tweets_top_hash_tag),

    path('chat/<str:username>', chat_box_view),
    path('chat/following/search', chat_box_search_view),

    # auth
    path('login/', login_view),
    path('logout/', logout_view),
    path('logout/js/', logout_view_js),
    path('register/', register_view),
    path('accounts/', include('allauth.urls')),

    # Api
    path('api/tweets/', include('tweets.api.urls')),
    path('api/logout/', logout_view_js),
    re_path(r'api/profiles?/', include('profiles.api.urls')),
    re_path(r'api/bookmark?/', include('bookmark.api.urls')),
    re_path(r'api/chatroom?/', include('chat.api.urls')),
    re_path(r'api/recommend_user?/', include('recommend-user.api.urls')),
    # fb

]

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
