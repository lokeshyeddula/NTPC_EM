from django.urls import path

from .views import (
    InspectionReportAPIView,
    InspectionPDFAPIView,
)
from .views import (
    ShiftReportAPIView,
)

urlpatterns = [

    # JSON API (React uses this)
    path(
        "inspection/<str:inspection_number>/",
        InspectionReportAPIView.as_view(),
        name="inspection-report",
    ),

    # PDF Download API
    path(
        "pdf/inspection/<str:inspection_number>/",
        InspectionPDFAPIView.as_view(),
        name="inspection-pdf",
    ),
path(

    "shift/",

    ShiftReportAPIView.as_view(),

    name="shift-report",

),

]