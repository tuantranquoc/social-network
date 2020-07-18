from django.shortcuts import render, redirect


# Create your views here.
def chat_box_search_view(request, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        return render(request, 'pages/chat_box_search.html', context={"profile_username": request.user.username})
    return redirect('/login/')





def chat_box_view(request, username, *args, **kwargs):
    if not request.user:
        return redirect("/login/")
    if request.user.is_authenticated:
        return render(request, 'pages/chat_box.html', context={"profile_username": username})
    return redirect('/login/')
