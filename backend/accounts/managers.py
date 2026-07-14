from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """
    Custom User Manager where Employee ID is the unique identifier.
    """

    use_in_migrations = True

    def create_user(self, emp_id, password=None, **extra_fields):
        if not emp_id:
            raise ValueError("Employee ID is required.")

        user = self.model(
            emp_id=emp_id,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, emp_id, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_first_login", False)

        return self.create_user(emp_id, password, **extra_fields)