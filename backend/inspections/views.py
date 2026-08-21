import logging

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from alerts.tasks import send_failure_email_task
from common.utils import get_current_shift
from machinery.models import MachineryType, Vehicle

from .models import (
    InspectionLog,
    InspectionResult,
    MachineryInspectionField,
)
from .serializers import (
    InspectionCreateSerializer,
    InspectionHistorySerializer,
    MachineryInspectionFieldSerializer,
)
from .utils import generate_inspection_number


logger = logging.getLogger(__name__)


# ============================================================
# MACHINERY CHECKLIST
# ============================================================

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


# ============================================================
# CHECK CURRENT VEHICLE STATUS
# ============================================================

class CheckVehicleStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicle_id = request.query_params.get("vehicle_id")

        if not vehicle_id:
            return Response(
                {
                    "error": "vehicle_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            latest_inspection = (
                InspectionLog.objects
                .filter(
                    vehicle_id=vehicle_id
                )
                .order_by("-created_at")
                .first()
            )

            # No previous inspection
            if not latest_inspection:
                return Response(
                    {
                        "is_unfit": False
                    },
                    status=status.HTTP_200_OK,
                )

            # Vehicle is currently UNFIT
            if (
                latest_inspection.operational_status
                and latest_inspection.operational_status.lower()
                == "unfit"
            ):
                failed_results = (
                    InspectionResult.objects
                    .filter(
                        inspection=latest_inspection,
                        result__iexact="Fail",
                    )
                    .select_related(
                        "inspection_field"
                    )
                )

                failed_fields = [
                    {
                        "id": result.inspection_field.id,
                        "field_name": (
                            result.inspection_field.field_name
                        ),
                    }
                    for result in failed_results
                ]

                return Response(
                    {
                        "is_unfit": True,
                        "original_inspection_id": (
                            latest_inspection.id
                        ),
                        "failed_fields": failed_fields,
                    },
                    status=status.HTTP_200_OK,
                )

            # Vehicle is FIT
            return Response(
                {
                    "is_unfit": False
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            logger.exception(
                "Error checking vehicle status. vehicle_id=%s",
                vehicle_id,
            )

            return Response(
                {
                    "error": "Unable to check vehicle status."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# PENDING RE-INSPECTIONS
# ============================================================

class PendingReinspectionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return vehicles whose MOST RECENT inspection is UNFIT.

        We first identify the latest inspection for every vehicle
        and only then check whether that inspection is UNFIT.

        This prevents a vehicle that was previously UNFIT but
        subsequently became FIT from appearing as pending.
        """

        latest_inspections = (
            InspectionLog.objects
            .select_related(
                "vehicle",
                "vehicle__machinery_type",
            )
            .order_by(
                "vehicle_id",
                "-created_at",
            )
            .distinct("vehicle_id")
        )

        pending_list = []

        for inspection in latest_inspections:

            if not inspection.operational_status:
                continue

            if (
                inspection.operational_status.lower()
                != "unfit"
            ):
                continue

            vehicle = inspection.vehicle
            machinery_type = vehicle.machinery_type

            pending_list.append(
                {
                    "vehicle_id": vehicle.id,
                    "machine_number": vehicle.machine_number,
                    "machinery_type_id": machinery_type.id,
                    "machinery_name": machinery_type.name,
                    "last_inspection_date": (
                        inspection.inspection_date
                    ),
                    "original_inspection_id": inspection.id,
                    "original_inspection_number": (
                        inspection.inspection_number
                    ),
                }
            )

        return Response(
            pending_list,
            status=status.HTTP_200_OK,
        )


# ============================================================
# CREATE INSPECTION
# ============================================================

class InspectionCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        # ----------------------------------------------------
        # 1. Validate request
        # ----------------------------------------------------

        serializer = InspectionCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # ----------------------------------------------------
        # 2. Get vehicle
        # ----------------------------------------------------

        try:
            vehicle = Vehicle.objects.get(
                id=serializer.validated_data["vehicle"]
            )
        except Vehicle.DoesNotExist:
            return Response(
                {
                    "error": "Vehicle not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # ----------------------------------------------------
        # 3. Create inspection
        # ----------------------------------------------------

        inspection = InspectionLog.objects.create(

            inspection_number=generate_inspection_number(),

            inspection_date=timezone.localdate(),

            shift=get_current_shift(),

            relay=serializer.validated_data["relay"],

            engineer=request.user,

            vehicle=vehicle,

            operational_status=(
                serializer.validated_data[
                    "operational_status"
                ]
            ),

            operator_name=(
                serializer.validated_data[
                    "operator_name"
                ]
            ),

            operator_employee_id=(
                serializer.validated_data[
                    "operator_employee_id"
                ]
            ),

            operator_agency=(
                serializer.validated_data[
                    "operator_agency"
                ]
            ),

            operator_mobile=(
                serializer.validated_data.get(
                    "operator_mobile",
                    "",
                )
            ),

            operator_checklist_filled=(
                serializer.validated_data[
                    "operator_checklist_filled"
                ]
            ),

            operator_remarks=(
                serializer.validated_data.get(
                    "operator_remarks",
                    "",
                )
            ),

            remarks=(
                serializer.validated_data.get(
                    "remarks",
                    "",
                )
            ),
        )

        # ----------------------------------------------------
        # 4. Save inspection results
        # ----------------------------------------------------

        results = serializer.validated_data["results"]

        for item in results:

            InspectionResult.objects.create(
                inspection=inspection,
                inspection_field_id=(
                    item["inspection_field"]
                ),
                result=item["result"],
            )

        # ----------------------------------------------------
        # 5. Refresh inspection
        # ----------------------------------------------------

        inspection.refresh_from_db()

        # ----------------------------------------------------
        # 6. Optional Celery failure notification
        # ----------------------------------------------------
        #
        # IMPORTANT:
        #
        # During development CELERY_ENABLED=False.
        #
        # Therefore Redis/Celery is NOT touched and cannot
        # interfere with inspection submission.
        #
        # Later, when Redis is configured, set:
        #
        # CELERY_ENABLED=True
        #
        # ----------------------------------------------------

        if getattr(
            settings,
            "CELERY_ENABLED",
            False,
        ):

            def send_failure_notification():

                try:

                    send_failure_email_task.delay(
                        inspection.id
                    )

                except Exception:

                    logger.exception(
                        "Unable to queue failure email "
                        "for inspection %s",
                        inspection.inspection_number,
                    )

            transaction.on_commit(
                send_failure_notification,
                robust=True,
            )

        else:

            logger.info(
                "Celery disabled. "
                "Failure email skipped for inspection %s.",
                inspection.inspection_number,
            )

        # ----------------------------------------------------
        # 7. Success response
        # ----------------------------------------------------

        return Response(
            {
                "success": True,
                "message": (
                    "Inspection saved successfully."
                ),
                "inspection_id": inspection.id,
                "inspection_number": (
                    inspection.inspection_number
                ),
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# INSPECTION HISTORY
# ============================================================

class InspectionHistoryAPIView(
    generics.ListAPIView
):
    permission_classes = [IsAuthenticated]

    serializer_class = InspectionHistorySerializer

    queryset = (
        InspectionLog.objects
        .select_related(
            "vehicle",
            "vehicle__machinery_type",
            "engineer",
        )
        .prefetch_related(
            "results__inspection_field",
        )
        .order_by("-created_at")
    )