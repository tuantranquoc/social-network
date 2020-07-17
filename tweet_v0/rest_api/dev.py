from rest_framework import authentication
from django.contrib.auth import get_user_model
from tweets.models import TestUser

User = get_user_model()


class DevAuthentication(authentication.BasicAuthentication):
    def authenticate(self, request):
        qs = User.objects.filter(id=17)
        user = qs.order_by("?").first()
        return user,None
