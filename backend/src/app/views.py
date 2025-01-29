from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

from app.models import Player




# All this code is used to test websockets behavior #

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                try:
                    login(request, user)
                    return HttpResponseRedirect('/app/home')
                except Exception as e:
                    print("Error: ", e)
            else:
                return render(
                    request, 'app/login.html', {
                        'message':
                        'Your account is disabled. Please contact the administrator.'
                    })
        else:
            return render(
                request, 'app/login.html', {
                    'message':
                    'Your username or password is incorrect. Please try again.'
                })
    else:
        return render(request, 'app/login.html', {})

def home(request): 
    return render(
        request,
        "app/home.html",
        {},
    )



