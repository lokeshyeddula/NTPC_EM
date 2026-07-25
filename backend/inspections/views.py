from django.db import transaction
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from alerts.tasks import send_failure_email_task
from common.utils import get_current_shift
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from machinery.models import Vehicle
from .models import InspectionLog
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


# ==========================================
# NEW ENDPOINT: Check Vehicle Status
# ==========================================
class CheckVehicleStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicle_id = request.query_params.get('vehicle_id')

        if not vehicle_id:
            return Response({"error": "vehicle_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check chronological history to see if the machine is currently broken
            latest_inspection = InspectionLog.objects.filter(
                vehicle_id=vehicle_id
            ).latest('created_at')

            if latest_inspection.operational_status.lower() == 'unfit':
                # Grab ONLY the fields that caused the failure
                failed_results = InspectionResult.objects.filter(
                    inspection=latest_inspection,
                    result__iexact='Fail'
                ).select_related('inspection_field')

                failed_fields = [
                    {
                        "id": res.inspection_field.id,
                        "field_name": res.inspection_field.field_name
                    } for res in failed_results
                ]

                return Response({
                    "is_unfit": True,
                    "original_inspection_id": latest_inspection.id,
                    "failed_fields": failed_fields
                }, status=status.HTTP_200_OK)

            else:
                return Response({"is_unfit": False}, status=status.HTTP_200_OK)

        except InspectionLog.DoesNotExist:
            return Response({"is_unfit": False}, status=status.HTTP_200_OK)

class PendingReinspectionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.select_related('machinery_type').all()
        pending_list = []

        for vehicle in vehicles:
            # Get the single most recent inspection for this vehicle
            latest_inspection = InspectionLog.objects.filter(
                vehicle=vehicle
            ).order_by('-created_at').first()

            if latest_inspection and latest_inspection.operational_status.lower() == 'unfit':
                pending_list.append({
                    "vehicle_id": vehicle.id,
                    "machine_number": vehicle.machine_number,
                    "machinery_type_id": vehicle.machinery_type.id,
                    "machinery_name": vehicle.machinery_type.name,
                    "last_inspection_date": latest_inspection.inspection_date,
                    "original_inspection_number": latest_inspection.inspection_number
                })

        return Response(pending_list)

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

            operational_status=serializer.validated_data[
                "operational_status"
            ],

            operator_name=serializer.validated_data[
                "operator_name"
            ],

            operator_employee_id=serializer.validated_data[
                "operator_employee_id"
            ],

            operator_agency=serializer.validated_data[
                "operator_agency"
            ],

            operator_mobile=serializer.validated_data.get(
                "operator_mobile",
                "",
            ),

            operator_checklist_filled=serializer.validated_data[
                "operator_checklist_filled"
            ],

            operator_remarks=serializer.validated_data.get(
                "operator_remarks",
                "",
            ),

            remarks=serializer.validated_data.get(
                "remarks",
                "",
            ),

            # If you add parent_inspection_id to your models.py later to link them,
            # you can map it here by extracting serializer.validated_data.get("parent_inspection_id")
        )

        for item in serializer.validated_data["results"]:
            InspectionResult.objects.create(
                inspection=inspection,
                inspection_field_id=item["inspection_field"],
                result=item["result"],
            )

        inspection.refresh_from_db()

        # Trigger Celery Alert if the inspection (or targeted reinspection) fails
        transaction.on_commit(
            lambda: send_failure_email_task.delay(inspection.id)
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
            "vehicle__machinery_type",  # NEW: Optimizes fetching the machinery type
            "engineer",
        )
        .prefetch_related(
            "results__inspection_field" # NEW: Optimizes fetching all failed items in one batch
        )
        .order_by("-created_at")
    )