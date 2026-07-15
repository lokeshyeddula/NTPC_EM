from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    MachineryTypeViewSet,
    VehicleViewSet,
    VehicleByMachineAPIView,
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
        "vehicles/by-type/<int:machinery_type_id>/",
        VehicleByMachineAPIView.as_view(),
        name="vehicles-by-type",
    ),

    path(
        "",
        include(router.urls),
    ),

]