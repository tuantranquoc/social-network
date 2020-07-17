from django.urls import path
from tweets.api import views

urlpatterns = [
    # Views
    path('', views.tweet_list_view),
    # Api
    path('create/', views.tweet_create_view),
    path('create/image/<int:tweet_id>', views.tweet_image_create_view),
    path('create/user/', views.tweet_create_view_django_user),
    path('action/', views.tweet_action_view),
    path('<int:tweet_id>/', views.tweet_details_view),
    path('<int:tweet_id>/delete/', views.tweet_delete_view),
    path('feed/', views.tweet_feed_view),
    path('comment/<int:tweet_id>', views.comment_api_view),
    path('comment/create/', views.comment_create_view),
    path('search/<str:key_item>', views.search),
    path('parent/<int:tweet_id>', views.tweet_parent_list_view),
    path('comment/parent/<int:comment_id>', views.comment_parent_list_view),
    path('comment/child/create/<int:comment_id>', views.child_comment_create_view),
    # community
    path('community/', views.community_list_view),
    path('community/create/<str:name>/', views.community_create_view),
    path('community/add/', views.communities_tweet_create),
    path('community/find/<str:community_type>/', views.tweet_by_community_view),
    # hash tag
    path('hash_tag/', views.hash_tag_views),
    path('hash_tag/search', views.hash_tag_search_view),
    path('hash_tag/split', views.spilt_hash_tag),
    path('hash_tag/create', views.hash_tag_create_views),
    path('hash_tag/top', views.top_hash_tag),

]
