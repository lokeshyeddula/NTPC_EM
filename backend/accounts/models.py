from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager


class Company(models.TextChoices):
    NTPC = "NTPC", "NTPC"
    VPR = "VPR", "VPR"
    NML = "NML", "NML"
    OTHER = "OTHER", "Other"


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

    full_name = models.CharField(
        max_length=150,
    )

    designation = models.CharField(
        max_length=150,
    )

    department = models.CharField(
        max_length=100,
        default="E&M",
        null=True,
    )

    company = models.CharField(
        max_length=20,
        choices=Company.choices,
        default=Company.NTPC,
    )

    email = models.EmailField(
        unique=True,
        null=True,
    )

    mobile_number = models.CharField(
        max_length=15,
        unique=True,
        null=True,
    )

    is_admin = models.BooleanField(
        default=False,
    )

    is_first_login = models.BooleanField(
        default=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    is_staff = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,  # Add this line
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    USERNAME_FIELD = "emp_id"

    REQUIRED_FIELDS = [
        "full_name",
        "designation",
        "department",
        "company",
        "email",
    ]

    objects = UserManager()

    class Meta:
        db_table = "users"
        ordering = ["emp_id"]

    def __str__(self):
        return f"{self.emp_id} - {self.full_name}"