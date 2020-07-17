from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.

class ChatRoom(models.Model):
    user = models.ManyToManyField(User, related_name="message", blank=True)

    def __id__(self):
        return self.id

    def __count__(self):
        return self.user.count()


class Content(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
