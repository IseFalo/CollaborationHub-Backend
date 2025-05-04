from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


urlpatterns=[
    path("", views.home, name="home"),
    path("auth/", views.auth_page, name="auth"),
    path('logout/', views.logout_user, name='logout'),
    path('create-task/', views.create_task, name='create_task'),
    path("task/", views.task, name="task"),
    path('tasks/<int:task_id>/move-to-todo/', views.move_to_todo, name='move_to_todo'),
    path('tasks/<int:task_id>/move-to-in-progress/', views.move_to_in_progress, name='move_to_in_progress'),
    path('tasks/<int:task_id>/move-to-completed/', views.move_to_completed, name='move_to_completed'),
]