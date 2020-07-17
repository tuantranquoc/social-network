from django.urls import path, include

from bookmark.api import views

urlpatterns = [
    # Views
    path('create', views.bookmark_create_view),
    path('', views.bookmark_view),

    # auth

    # Api
]