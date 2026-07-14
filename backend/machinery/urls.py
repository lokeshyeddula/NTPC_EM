from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import VehicleByMachineAPIView
from .views import (
    MachineryTypeViewSet,
    VehicleViewSet,
)

router = DefaultRouter()

router.register(
    "types",
    MachineryTypeViewSet,
)

router.register(
    "vehicles",
    VehicleViewSet,
)

urlpatterns = [
    path(
        "",
        include(router.urls),
    ),
    path(
    "vehicles/<str:machine>/",
    VehicleByMachineAPIView.as_view(),
),
]