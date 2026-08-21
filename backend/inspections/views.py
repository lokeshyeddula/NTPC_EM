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

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        machinery_type_id = self.kwargs[
            "machinery_type_id"
        ]

        try:

            machinery = MachineryType.objects.get(
                id=machinery_type_id
            )

        except MachineryType.DoesNotExist:

            raise NotFound(
                "Machine type not found."
            )

        return (
            MachineryInspectionField.objects
            .select_related(
                "inspection_field",
                "machinery_type",
            )
            .filter(
                machinery_type=machinery
            )
            .order_by(
                "display_order"
            )
        )


# ============================================================
# CHECK CURRENT VEHICLE STATUS
# ============================================================

class CheckVehicleStatusAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        vehicle_id = request.query_params.get(
            "vehicle_id"
        )

        if not vehicle_id:

            return Response(
                {
                    "error":
                    "vehicle_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            latest_inspection = (
                InspectionLog.objects
                .filter(
                    vehicle_id=vehicle_id
                )
                .order_by(
                    "-created_at"
                )
                .first()
            )

            if not latest_inspection:

                return Response(
                    {
                        "is_unfit": False
                    },
                    status=status.HTTP_200_OK,
                )

            if (
                latest_inspection.operational_status
                and
                latest_inspection.operational_status.lower()
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
                        "id":
                        result.inspection_field.id,

                        "field_name":
                        result.inspection_field.field_name,
                    }

                    for result in failed_results

                ]

                return Response(
                    {
                        "is_unfit": True,

                        "original_inspection_id":
                        latest_inspection.id,

                        "failed_fields":
                        failed_fields,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "is_unfit": False
                },
                status=status.HTTP_200_OK,
            )

        except Exception:

            logger.exception(
                "Error checking vehicle status. "
                "vehicle_id=%s",
                vehicle_id,
            )

            return Response(
                {
                    "error":
                    "Unable to check vehicle status."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# PENDING RE-INSPECTIONS
# ============================================================

class PendingReinspectionsAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        """
        Return vehicles whose MOST RECENT inspection
        is UNFIT.

        If the latest inspection is FIT, the vehicle
        is not pending even if an older inspection was UNFIT.
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

            .distinct(
                "vehicle_id"
            )
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

            machinery_type = (
                vehicle.machinery_type
            )

            pending_list.append(
                {
                    "vehicle_id":
                    vehicle.id,

                    "machine_number":
                    vehicle.machine_number,

                    "machinery_type_id":
                    machinery_type.id,

                    "machinery_name":
                    machinery_type.name,

                    "last_inspection_date":
                    inspection.inspection_date,

                    "original_inspection_id":
                    inspection.id,

                    "original_inspection_number":
                    inspection.inspection_number,
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

    permission_classes = [
        IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request):

        # ----------------------------------------------------
        # 1. VALIDATE REQUEST
        # ----------------------------------------------------

        serializer = InspectionCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        data = serializer.validated_data

        # ----------------------------------------------------
        # 2. GET VEHICLE
        # ----------------------------------------------------

        try:

            vehicle = Vehicle.objects.get(
                id=data["vehicle"]
            )

        except Vehicle.DoesNotExist:

            return Response(
                {
                    "error":
                    "Vehicle not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # ----------------------------------------------------
        # 3. RE-INSPECTION PARENT
        # ----------------------------------------------------

        is_reinspection = data.get(
            "is_reinspection",
            False,
        )

        parent_inspection = None

        if is_reinspection:

            parent_inspection = (
                InspectionLog.objects.get(
                    id=data[
                        "parent_inspection_id"
                    ]
                )
            )

        # ----------------------------------------------------
        # 4. CREATE INSPECTION
        # ----------------------------------------------------

        inspection = InspectionLog.objects.create(

            inspection_number=
            generate_inspection_number(),

            inspection_date=
            timezone.localdate(),

            shift=
            get_current_shift(),

            relay=
            data["relay"],

            engineer=
            request.user,

            vehicle=
            vehicle,

            parent_inspection=
            parent_inspection,

            operational_status=
            data["operational_status"],

            operator_name=
            data["operator_name"],

            operator_employee_id=
            data["operator_employee_id"],

            operator_agency=
            data["operator_agency"],

            operator_mobile=
            data.get(
                "operator_mobile",
                "",
            ),

            operator_checklist_filled=
            data[
                "operator_checklist_filled"
            ],

            operator_remarks=
            data.get(
                "operator_remarks",
                "",
            ),

            remarks=
            data.get(
                "remarks",
                "",
            ),
        )

        # ----------------------------------------------------
        # 5. SAVE INSPECTION RESULTS
        # ----------------------------------------------------

        results = data[
            "results"
        ]

        inspection_results = [

            InspectionResult(

                inspection=
                inspection,

                inspection_field_id=
                item[
                    "inspection_field"
                ],

                result=
                item[
                    "result"
                ],
            )

            for item in results

        ]

        if inspection_results:

            InspectionResult.objects.bulk_create(
                inspection_results
            )

        # ----------------------------------------------------
        # 6. FAILURE EMAIL
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

        # ----------------------------------------------------
        # 7. SUCCESS RESPONSE
        # ----------------------------------------------------

        return Response(

            {
                "success": True,

                "message": (
                    "Re-inspection saved successfully."
                    if is_reinspection
                    else
                    "Inspection saved successfully."
                ),

                "inspection_id":
                inspection.id,

                "inspection_number":
                inspection.inspection_number,

                "is_reinspection":
                is_reinspection,

                "parent_inspection_id":
                inspection.parent_inspection_id,

                "operational_status":
                inspection.operational_status,
            },

            status=status.HTTP_201_CREATED,
        )


# ============================================================
# INSPECTION HISTORY
# ============================================================

class InspectionHistoryAPIView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        InspectionHistorySerializer
    )

    queryset = (

        InspectionLog.objects

        .select_related(
            "vehicle",
            "vehicle__machinery_type",
            "engineer",
            "parent_inspection",
        )

        .prefetch_related(
            "results__inspection_field",
        )

        .order_by(
            "-created_at"
        )
    )