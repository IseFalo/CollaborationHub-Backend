from django import forms
from .models import Team, Task

class TeamForm(forms.ModelForm):
    class Meta:
        model = Team
        fields = ['name']

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'due_date', 'assigned_to']

class InviteMemberForm(forms.Form):
    username = forms.CharField(label="Username to invite")
