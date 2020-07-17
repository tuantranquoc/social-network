from django.contrib.auth import get_user_model
from django.db.models import Count, Max, Q
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from itertools import chain
from profiles.models import Profile
from profiles.serializers import PublicProfileSerializer
from ..models import ChatRoom, Content
from ..serializers import ChatRoomSerializer, ContentSerializer

User = get_user_model()


def get_paginated_queryset_recommend_user_response(query_set, request):
    paginator = PageNumberPagination()
    paginator.page_size = 3
    paginated_qs = paginator.paginate_queryset(query_set, request)
    serializer = PublicProfileSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def create_chat_room(request, username, *args, **kwargs):
    if request.user.is_authenticated:
        user = request.user
        target_user = User.objects.filter(username=username).first()
        chat_room = ChatRoom.objects.filter(user=user).filter(user=target_user).first()
        if not chat_room:
            b = ChatRoom.objects.create()
            if b:
                b.user.add(user)
                b.user.add(target_user)
                print(b.user.all())
                serializer = ChatRoomSerializer(b)
                return Response(serializer.data, status=200)
        serializer = ChatRoomSerializer(chat_room)
        return Response(serializer.data, status=400)
    return Response({}, status=403)


@api_view(['POST'])
def create_chat(request, username, *args, **kwargs):
    if request.user.is_authenticated:
        user = request.user
        target_user = User.objects.filter(username=username).first()
        content = request.data.get("content")
        if content:
            chat_room = ChatRoom.objects.filter(user=user).filter(user=target_user).first()
            print(chat_room.user.all())
            chat_room_id = chat_room.id
            new_content = Content.objects.create(user=user, chat_room=chat_room, content=content)

            serializer = ContentSerializer(new_content)
            print(serializer.data)
            return Response(serializer.data, status=201)
        return Response({}, status=400)
    return Response({}, status=403)


@api_view(['GET'])
def get_chat_view(request, username, *args, **kwargs):
    if request.user.is_authenticated:
        user = request.user
        target_user = User.objects.filter(username=username).first()

        chat_room = ChatRoom.objects.filter(user=user).filter(user=target_user).first()
        if not chat_room:
            chat_room = ChatRoom.objects.create()
            chat_room.user.add(user)
            chat_room.user.add(target_user)

        content_list = Content.objects.filter(chat_room=chat_room).filter(
            Q(user=request.user) | Q(user=target_user)).order_by("timestamp")

        serializer = ContentSerializer(content_list, many=True)
        print(serializer.data)
        return Response(serializer.data, status=200)
    return Response({}, status=400)
