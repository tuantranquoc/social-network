from django.urls import path
from ..api import views

urlpatterns = [
    path("user/<str:username>", views.recommend_user_from_profile),
    path("feed/", views.recommend_user_from_feed),
    path("global/", views.recommend_user_from_global),
]
