from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


def title_case(value):
    """
    Convert text to proper title case.

    Example:
    LOKESH YEDDULA -> Lokesh Yeddula
    assistant manager -> Assistant Manager
    """

    if not value:
        return value

    return " ".join(
        word.capitalize()
        for word in value.strip().split()
    )


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = (
            "emp_id",
            "full_name",
            "designation",
            "department",
            "company",
            "email",
            "mobile_number",
            "password",
            "confirm_password",
        )

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                        "Passwords do not match."
                }
            )

        # -----------------------------------------
        # NORMALIZE NAME & DESIGNATION
        # -----------------------------------------

        attrs["full_name"] = title_case(
            attrs["full_name"]
        )

        attrs["designation"] = title_case(
            attrs["designation"]
        )

        return attrs

    def create(self, validated_data):

        validated_data.pop(
            "confirm_password"
        )

        password = validated_data.pop(
            "password"
        )

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        return user


class LoginSerializer(serializers.Serializer):

    emp_id = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )

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
        min_length=8,
    )


class UserSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = User

        fields = (
            "id",
            "emp_id",
            "full_name",
            "designation",
            "department",
            "company",
            "email",
            "mobile_number",
            "is_admin",
            "is_first_login",
        )


class ProfileUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = User

        fields = (
            "full_name",
            "designation",
            "department",
            "company",
            "email",
            "mobile_number",
        )

    def validate_full_name(self, value):

        return title_case(value)

    def validate_designation(self, value):

        return title_case(value)