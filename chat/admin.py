from django.contrib import admin
from .models import ChatRoom, Content


# Register your models here.

class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['__id__','__count__']

    class Meta:
        model = ChatRoom


admin.site.register(ChatRoom, ChatRoomAdmin)
