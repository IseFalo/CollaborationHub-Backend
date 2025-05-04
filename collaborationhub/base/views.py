from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Team, Task
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
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



@login_required
def home(request):
    # Get the user's teams
    user_teams = request.user.teams.all()

    # If the user is not part of any team, display empty lists
    if not user_teams.exists():
        return render(request, 'index.html', {'pending_tasks': [], 'team_members': []})

    # Get the user's first team (you can modify this if the user belongs to multiple teams)
    user_team = user_teams.first()

    # Get pending tasks (both To-Do and In Progress)
    pending_tasks = Task.objects.filter(assigned_to__in=user_team.members.all(), status__in=['todo', 'in_progress'])

    # Get team members
    team_members = user_team.members.all()

    context = {
        'pending_tasks': pending_tasks,
        'team_members': team_members,
        'user_teams':user_teams,
    }

    return render(request, 'index.html', context)

@login_required
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        assigned_to_id = request.POST.get('assignee')
        status = request.POST.get('status')

        if not title or not assigned_to_id:
            return redirect('task')  # or render an error message

        assigned_to = User.objects.get(id=assigned_to_id)

        Task.objects.create(
            title=title,
            description=description,
            assigned_to=assigned_to,
            status=status
        )
        return redirect('task')

    return redirect('task')


@login_required
def task(request):
    user_teams = request.user.teams.all()

    if not user_teams.exists():
        return render(request, 'task.html', {
            'todo_tasks': [],
            'in_progress_tasks': [],
            'completed_tasks': [],
            'team_members': [],
            'user_teams': [],  # ✅ add this line
        })

    user_team = user_teams.first()

    tasks = Task.objects.filter(assigned_to__in=user_team.members.all())

    todo_tasks = tasks.filter(status='todo')
    in_progress_tasks = tasks.filter(status='in_progress')
    completed_tasks = tasks.filter(status='completed')

    context = {
        'todo_tasks': todo_tasks,
        'in_progress_tasks': in_progress_tasks,
        'completed_tasks': completed_tasks,
        'team_members': user_team.members.all(),
        'user_teams': user_teams,  # ✅ add this line too
    }

    return render(request, 'task.html', context)



@login_required
def move_to_todo(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.status = 'todo'
    task.save()
    return redirect('task')

@login_required
def move_to_in_progress(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.status = 'in_progress'
    task.save()
    return redirect('task')

@login_required
def move_to_completed(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.status = 'completed'
    task.save()
    return redirect('task')

@login_required
def logout_user(request):
    logout(request)
    return redirect('auth') 