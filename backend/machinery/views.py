from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import MachineryType, Vehicle
from .serializers import (
    MachineryTypeSerializer,
    VehicleSerializer,
)
from rest_framework.generics import ListAPIView

from .serializers import VehicleSerializer


class VehicleByMachineAPIView(ListAPIView):

    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        machine = self.kwargs["machine"]

        return Vehicle.objects.filter(
            machinery_type__name__iexact=machine,
            status="Active",
        ).order_by("machine_number")

class MachineryTypeViewSet(viewsets.ModelViewSet):

    queryset = MachineryType.objects.all()

    serializer_class = MachineryTypeSerializer

    permission_classes = [IsAuthenticated]


class VehicleViewSet(viewsets.ModelViewSet):

    queryset = Vehicle.objects.select_related(
        "machinery_type"
    )

    serializer_class = VehicleSerializer

    permission_classes = [IsAuthenticated]