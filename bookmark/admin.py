from django.contrib import admin
from .models import Bookmark


# Register your models here.

class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['__str__']

    class Meta:
        model = Bookmark


admin.site.register(Bookmark, BookmarkAdmin)
