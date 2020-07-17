
from django.urls import path, include

from profiles import views

urlpatterns = [
    # Views
    path('<str:username>', views.profile_detail_view),
    path('<str:username>/following', views.profile_following_view),
    path('<str:username>/follower', views.profile_follower_view),
    path('edit/', views.profile_update_via_react_view),
    path('edit/view/', views.profile_update_view_page),
    path('', views.profile_user_detail_view),

    # auth

    # Api



]


