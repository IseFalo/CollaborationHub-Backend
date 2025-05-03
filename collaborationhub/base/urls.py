from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


urlpatterns=[
    path("", views.home, name="home"),
    path("auth/", views.auth_page, name="auth"),
    path('login/', auth_views.LoginView.as_view(template_name='login.html', next_page='home'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path("task/", views.task, name="task")
]