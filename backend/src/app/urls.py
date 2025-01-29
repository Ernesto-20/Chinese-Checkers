from django.urls import re_path
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import views as auth_views
from app import views

urlpatterns = [
    re_path(r"^$", views.user_login, name="login"),
    re_path(r"^home/$", views.home, name="home"),
]
