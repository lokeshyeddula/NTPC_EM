from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User
from .forms import CustomUserCreationForm


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    add_form = CustomUserCreationForm

    model = User

    ordering = ("emp_id",)

    list_display = (
        "emp_id",
        "full_name",
        "designation",
        "department",
        "is_admin",
        "is_first_login",
        "is_active",
    )

    search_fields = (
        "emp_id",
        "full_name",
    )

    list_filter = (
        "is_admin",
        "is_active",
    )

    fieldsets = (
        (
            "Login",
            {
                "fields": (
                    "emp_id",
                    "password",
                )
            },
        ),

        (
            "Personal Details",
            {
                "fields": (
                    "full_name",
                    "designation",
                    "department",
                    "email",
                    "mobile_number",
                )
            },
        ),

        (
            "Permissions",
            {
                "fields": (
                    "is_admin",
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "is_first_login",
                    "groups",
                    "user_permissions",
                )
            },
        ),

        (
            "Dates",
            {
                "fields": (
                    "last_login",
                    "date_created",
                    "updated_at",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "emp_id",
                    "full_name",
                    "designation",
                    "department",
                    "email",
                    "mobile_number",
                    "is_admin",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )

    def save_model(self, request, obj, form, change):

        if not change:
            obj.set_password("Welcome@123")
            obj.is_first_login = True

        super().save_model(request, obj, form, change)