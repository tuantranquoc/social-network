from django.urls import path
from ..api import views

urlpatterns = [
    # Views
    path('<str:username>/follow', views.profile_detail_api_view),
    path('<str:username>/', views.profile_detail_api_view),
    path('upload/he/', views.profile_image_post),
    path('upload/avatar/', views.profile_avatar_post),
    path('upload/background/', views.profile_background_post),
    path('<str:username>/following/all', views.get_following_profiles),
    path('<str:username>/follower/all', views.get_follower_profiles),
]
