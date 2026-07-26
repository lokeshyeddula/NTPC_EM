from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from inspections.models import InspectionLog
from rest_framework.generics import ListAPIView
from django.http import HttpResponse

# Added generate_daily_pdf to the imports
from .pdf_generator import (
    generate_inspection_pdf,
    generate_shift_pdf,
    generate_daily_pdf,
    generate_monthly_pdf
)
from .serializers import (
    InspectionReportSerializer,
)
from reporting.serializers import (
    ShiftReportSerializer,
)


# ----------------------------
# PDF Download API
# ----------------------------

class InspectionPDFAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, inspection_number):
        inspection = (
            InspectionLog.objects
            .select_related(
                "engineer",
                "vehicle",
                "vehicle__machinery_type",
            )
            .get(
                inspection_number=inspection_number
            )
        )

        pdf = generate_inspection_pdf(inspection)

        response = HttpResponse(
            pdf,
            content_type="application/pdf"
        )
        response["Content-Disposition"] = (
            f'attachment; filename="{inspection_number}.pdf"'
        )
        return response


class ShiftReportAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShiftReportSerializer

    def get_queryset(self):
        queryset = (
            InspectionLog.objects
            .select_related(
                "engineer",
                "vehicle",
            )
        )

        shift = self.request.GET.get("shift")
        relay = self.request.GET.get("relay")
        date = self.request.GET.get("date")

        if shift:
            queryset = queryset.filter(shift=shift)
        if relay:
            queryset = queryset.filter(relay=relay)
        if date:
            queryset = queryset.filter(inspection_date=date)

        return queryset.order_by(
            "-inspection_date",
            "-inspection_number",
        )


class ShiftPDFAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shift = request.GET.get("shift")
        date_str = request.GET.get("date")

        if not shift or not date_str:
            return HttpResponse("Missing date or shift parameters", status=400)

        # Optimize query to fetch all required relationships efficiently
        queryset = (
            InspectionLog.objects
            .select_related(
                "engineer",
                "vehicle",
                "vehicle__machinery_type",
            )
            .prefetch_related(
                "results__inspection_field"  # Needed for failed items extraction
            )
            .filter(
                shift__iexact=shift,
                inspection_date=date_str
            )
            .order_by("created_at")
        )

        pdf = generate_shift_pdf(queryset, date_str, shift)

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Shift_Report_{date_str}_{shift}.pdf"'

        return response


# ----------------------------
# NEW: Daily PDF View
# ----------------------------
class DailyPDFAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_str = request.GET.get("date")

        if not date_str:
            return HttpResponse("Missing date parameter", status=400)

        # Fetch all inspections for that date
        queryset = (
            InspectionLog.objects
            .select_related(
                "engineer",
                "vehicle",
                "vehicle__machinery_type",
            )
            .prefetch_related(
                "results__inspection_field"
            )
            .filter(
                inspection_date=date_str
            )
            .order_by("created_at")
        )

        # Generate the PDF
        pdf = generate_daily_pdf(queryset, date_str)

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Daily_Report_{date_str}.pdf"'

        return response


class MonthlyPDFAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month_str = request.GET.get("month")  # Expected format: YYYY-MM

        if not month_str:
            return HttpResponse("Missing month parameter", status=400)

        # Fetch all inspections starting with that Year-Month
        queryset = (
            InspectionLog.objects
            .select_related(
                "engineer",
                "vehicle",
                "vehicle__machinery_type",
            )
            .prefetch_related(
                "results__inspection_field"
            )
            .filter(
                inspection_date__startswith=month_str
            )
            .order_by("created_at")
        )

        pdf = generate_monthly_pdf(queryset, month_str)

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Monthly_Summary_{month_str}.pdf"'

        return response
class InspectionReportAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InspectionReportSerializer
    lookup_field = "inspection_number"

    queryset = (
        InspectionLog.objects
        .select_related(
            "engineer",
            "vehicle",
            "vehicle__machinery_type",
        )
    )