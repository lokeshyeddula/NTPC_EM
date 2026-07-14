from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Allows access only to NTPC Admin users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_admin
        )