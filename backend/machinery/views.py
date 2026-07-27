from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MachineryType, Vehicle
from .serializers import MachineryTypeSerializer, VehicleSerializer


class VehicleByMachineAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        machinery_type_id = self.kwargs["machinery_type_id"]

        # Fetch ONLY 'id' and 'machine_number' as lightweight dictionaries.
        # This completely bypasses the memory-heavy VehicleSerializer and prevents OOM crashes.
        vehicles = Vehicle.objects.filter(
            machinery_type_id=machinery_type_id,
            status="Active",
        ).values("id", "machine_number").order_by("machine_number")

        return Response(list(vehicles))


class MachineryTypeViewSet(viewsets.ModelViewSet):
    queryset = MachineryType.objects.filter(
        name__in=[
            "Tipper",
            "Excavator",
            "Surface Miner",
            "Dozer",
            "Grader",
            "Wheel Loader",
            "Water Tanker",
            "Diesel Tanker",
            "Service Van",
            "Crane",
            "Drill Machine",
            "Bus",
        ]
    ).order_by("name")

    serializer_class = MachineryTypeSerializer
    permission_classes = [IsAuthenticated]


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.select_related(
        "machinery_type"
    )

    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]