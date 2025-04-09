from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .models import Team, Task
from django.contrib.auth.models import User
from .forms import TeamForm, TaskForm, InviteMemberForm

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})



def home(request):
    return render(request, 'index.html')
def task(request):
    return render(request, 'task.html')
@login_required
def create_team(request):
    if request.method == 'POST':
        form = TeamForm(request.POST)
        if form.is_valid():
            team = form.save(commit=False)
            team.manager = request.user
            team.save()
            team.members.add(request.user)
            return redirect('dashboard')
    else:
        form = TeamForm()
    return render(request, 'create_team.html', {'form': form})