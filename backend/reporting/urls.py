from django.urls import path

from .views import (
    InspectionReportAPIView,
    InspectionPDFAPIView,
    ShiftReportAPIView,
    ShiftPDFAPIView,
)


urlpatterns = [
    # JSON API
    path("inspection/<str:inspection_number>/", InspectionReportAPIView.as_view(), name="inspection-report"),
    path("shift/", ShiftReportAPIView.as_view(), name="shift-report"),

    # PDF Download APIs
    path("pdf/inspection/<str:inspection_number>/", InspectionPDFAPIView.as_view(), name="inspection-pdf"),
    path("pdf/shift/", ShiftPDFAPIView.as_view(), name="shift-pdf"), # New Endpoint
]