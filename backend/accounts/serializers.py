from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User


class LoginSerializer(serializers.Serializer):
    emp_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        emp_id = attrs.get("emp_id")
        password = attrs.get("password")

        user = authenticate(
            username=emp_id,
            password=password,
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid Employee ID or Password."
            )

        attrs["user"] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()

    new_password = serializers.CharField(
        min_length=8
    )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = [
            "id",
            "emp_id",
            "full_name",
            "designation",
            "department",
            "email",
            "mobile_number",
            "is_admin",
            "is_first_login",
        ]