from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import User
from .constants import DEFAULT_PASSWORD


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = (
            "emp_id",
            "full_name",
            "designation",
            "department",
            "email",
            "mobile_number",
            "is_admin",
            "is_staff",
            "is_active",
        )

    def save(self, commit=True):
        user = super().save(commit=False)

        user.set_password(DEFAULT_PASSWORD)
        user.is_first_login = True

        if commit:
            user.save()

        return user