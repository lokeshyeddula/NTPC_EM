from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager


class User(AbstractUser):
    """
    Custom User Model
    Employee ID is used as username.
    """

    username = None
    first_name = None
    last_name = None

    emp_id = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Employee ID",
    )

    full_name = models.CharField(max_length=150)

    designation = models.CharField(max_length=150)

    department = models.CharField(
        max_length=100,
        default="E&M",
    )

    email = models.EmailField(
        blank=True,
        null=True,
    )

    mobile_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
    )

    is_admin = models.BooleanField(default=False)

    is_first_login = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "emp_id"

    REQUIRED_FIELDS = [
        "full_name",
        "designation",
    ]

    objects = UserManager()

    class Meta:
        db_table = "users"
        ordering = ["emp_id"]

    def __str__(self):
        return f"{self.emp_id} - {self.full_name}"