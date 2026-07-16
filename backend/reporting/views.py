from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from inspections.models import InspectionLog
from django.http import HttpResponse
from .pdf_generator import generate_inspection_pdf
from .serializers import (
    InspectionReportSerializer,
)

# ----------------------------
# PDF Download API
# ----------------------------

class InspectionPDFAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

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

        pdf = generate_inspection_pdf(
            inspection
        )

        response = HttpResponse(
            pdf,
            content_type="application/pdf"
        )

        response[
            "Content-Disposition"
        ] = (
            f'attachment; filename="{inspection_number}.pdf"'
        )

        return response
class InspectionReportAPIView(
    generics.RetrieveAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        InspectionReportSerializer
    )

    queryset = (
        InspectionLog.objects
        .select_related(
            "engineer",
            "vehicle",
            "vehicle__machinery_type",
        )
    )

    lookup_field = "inspection_number"