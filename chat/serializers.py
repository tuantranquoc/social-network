from rest_framework import serializers

from chat.models import ChatRoom, Content


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'user']


class ContentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Content
        fields = ['id', 'username', 'content', 'timestamp']

    def get_username(self,obj):
        return obj.user.username
