from django.urls import path
from ..api import views

urlpatterns = [
    path("create/<str:username>", views.create_chat_room),
    path("chat/<str:username>", views.create_chat),
    path("get/<str:username>", views.get_chat_view),
]
