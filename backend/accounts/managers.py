from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """
    Custom User Manager
    Employee ID is used as the username.
    """

    use_in_migrations = True

    def create_user(self, emp_id, password=None, **extra_fields):
        if not emp_id:
            raise ValueError("Employee ID is required.")

        email = extra_fields.get("email")

        if email:
            extra_fields["email"] = self.normalize_email(email)

        user = self.model(
            emp_id=emp_id.upper().strip(),
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

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(
            emp_id,
            password=password,
            **extra_fields,
        )