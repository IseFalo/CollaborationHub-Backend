from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Team, Task
from django.contrib import messages
from django.contrib.auth import get_user_model

User = get_user_model()

def auth_page(request):
    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'signup':
            full_name = request.POST.get('fullname')
            username = request.POST.get('username')
            password = request.POST.get('password')
            confirm_password = request.POST.get('confirm_password')
            team_id = request.POST.get('team')

            if password != confirm_password:
                messages.error(request, "Passwords do not match.")
                return redirect('auth')

            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists.")
                return redirect('auth')

            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                messages.error(request, "Selected team does not exist.")
                return redirect('auth')

            # Create user
            user = User.objects.create_user(username=username, full_name=full_name, password=password)

            # Add user to team
            team.members.add(user)

            messages.success(request, "Account created. Please log in.")
            return redirect('auth')

        elif action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')  # Change to your post-login page
            else:
                messages.error(request, "Invalid credentials.")
                return redirect('auth')

    teams = Team.objects.all()
    return render(request, 'auth.html', {'teams': teams})




def home(request):
    user_teams = request.user.teams.all()
    return render(request, 'index.html', {'user_teams': user_teams})

def task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        assigned_to_id = request.POST.get('assignee')
        status = request.POST.get('status')

        if not title or not assigned_to_id:
            return render(request, 'task.html', {'error': 'Title and assignee are required'})

        assigned_to = User.objects.get(id=assigned_to_id)

        Task.objects.create(
            title=title,
            description=description,
            assigned_to=assigned_to,
            status=status
        )
        return redirect('task')

    # Get team members
    team = request.user.teams.first() if request.user.teams.exists() else None
    team_members = team.members.all() if team else []

    # Get tasks by status
    tasks = Task.objects.filter(assigned_to__in=team_members)
    todo_tasks = tasks.filter(status='todo')
    in_progress_tasks = tasks.filter(status='in_progress')
    completed_tasks = tasks.filter(status='completed')

    context = {
        'team_members': team_members,
        'todo_tasks': todo_tasks,
        'in_progress_tasks': in_progress_tasks,
        'completed_tasks': completed_tasks,
    }

    return render(request, 'task.html', context)


