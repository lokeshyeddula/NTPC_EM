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
    InspectionHistorySerializer,
)


class MachineryChecklistAPIView(generics.ListAPIView):

    serializer_class = MachineryInspectionFieldSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        machinery_type_id = self.kwargs["machinery_type_id"]

        try:

            machinery = MachineryType.objects.get(
                id=machinery_type_id
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

            operator_name=serializer.validated_data["operator_name"],

            operator_employee_id=serializer.validated_data["operator_employee_id"],

            operator_agency=serializer.validated_data["operator_agency"],

            operator_mobile=serializer.validated_data.get(
                "operator_mobile",
                "",
            ),

            operator_checklist_filled=serializer.validated_data[
                "operator_checklist_filled"
            ],
            operator_remarks=serializer.validated_data.get("operator_remarks", ""),

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

class InspectionHistoryAPIView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = InspectionHistorySerializer

    queryset = (
        InspectionLog.objects
        .select_related(
            "vehicle",
            "engineer",
        )
        .order_by("-created_at")
    )