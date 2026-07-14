from django.db import transaction
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_current_shift

from inspections.utils import generate_inspection_number

from machinery.models import MachineryType, Vehicle

from .models import (
    MachineryInspectionField,
    InspectionLog,
    InspectionResult,
)

from .serializers import (
    MachineryInspectionFieldSerializer,
    InspectionCreateSerializer,
)


class MachineryChecklistAPIView(generics.ListAPIView):

    serializer_class = MachineryInspectionFieldSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        machine_type = self.kwargs["machine_type"]

        try:
            machinery = MachineryType.objects.get(
                name__iexact=machine_type
            )

        except MachineryType.DoesNotExist:
            raise NotFound("Machine type not found.")

        return (
            MachineryInspectionField.objects
            .select_related(
                "inspection_field",
                "machinery_type",
            )
            .filter(
                machinery_type=machinery
            )
            .order_by("display_order")
        )


class InspectionCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        serializer = InspectionCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        vehicle = Vehicle.objects.get(
            id=serializer.validated_data["vehicle"]
        )

        inspection = InspectionLog.objects.create(
            inspection_number=generate_inspection_number(),
            inspection_date=timezone.localdate(),
            shift=get_current_shift(),
            relay=serializer.validated_data["relay"],
            engineer=request.user,
            vehicle=vehicle,
            operational_status=serializer.validated_data["operational_status"],
            remarks=serializer.validated_data.get(
                "remarks",
                "",
            ),
        )

        for item in serializer.validated_data["results"]:

            InspectionResult.objects.create(
                inspection=inspection,
                inspection_field_id=item["inspection_field"],
                result=item["result"],
            )

        return Response(
            {
                "success": True,
                "inspection_number": inspection.inspection_number,
            },
            status=status.HTTP_201_CREATED,
        )