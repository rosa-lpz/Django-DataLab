from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

from users import views


urlpatterns = [
    path('login/',views.user_login, name="login"),
    path('logout/',auth_views.LogoutView.as_view(template_name='login/logout.html'), name='logout'),
]