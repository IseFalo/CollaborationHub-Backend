from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import Team  # If Team is a model in your app

ACCOUNT_TYPE_CHOICES = [
    ('user', 'User'),
    ('admin', 'Admin'),
]

class CustomSignupForm(UserCreationForm):
    full_name = forms.CharField(required=True)
    email = forms.EmailField(required=True)
    team = forms.ModelChoiceField(queryset=Team.objects.all(), empty_label="Select your team")
    account_type = forms.ChoiceField(choices=ACCOUNT_TYPE_CHOICES, widget=forms.RadioSelect)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'team', 'account_type', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['full_name']
        if commit:
            user.save()
        return user

class CustomLoginForm(AuthenticationForm):
    username = forms.EmailField(label="Email", widget=forms.EmailInput())
