from django.contrib import admin
from .models import Tweet, Community, HashTag


# Register your models here.

# display model and list model.
class HashTagAdmin(admin.ModelAdmin):
    list_display = ['__str__', '__count__']

    class Meta:
        model = HashTag


class CommunityAdmin(admin.ModelAdmin):
    list_display = ['__str__', '__count__']

    class Meta:
        model = Community


class TweetAdmin(admin.ModelAdmin):
    list_display = ['user', '__str__', '__time__', '__like__']
    search_fields = ['user__username', 'content']

    class Meta:
        model = Tweet


admin.site.register(Tweet, TweetAdmin)
admin.site.register(Community, CommunityAdmin)
admin.site.register(HashTag, HashTagAdmin)
