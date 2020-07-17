from django.shortcuts import render, redirect


# Create your views here.
def bookmark_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return render(request, "bookmark/bookmark.html")
    return redirect('/login/')
