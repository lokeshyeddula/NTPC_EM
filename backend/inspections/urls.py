from django.urls import path

from .views import (
    MachineryChecklistAPIView,
    InspectionCreateAPIView,
    InspectionHistoryAPIView,
    CheckVehicleStatusAPIView,
    PendingReinspectionsAPIView,
)

path('reinspections/pending/', PendingReinspectionsAPIView.as_view(), name='pending-reinspections'),
urlpatterns = [

    path(
        "checklists/<int:machinery_type_id>/",
        MachineryChecklistAPIView.as_view(),
        name="machine-checklist",
    ),

    path(
        "create/",
        InspectionCreateAPIView.as_view(),
        name="inspection-create",
    ),

    path(
        "history/",
        InspectionHistoryAPIView.as_view(),
        name="inspection-history",
    ),

    path(
        'check-status/',
        CheckVehicleStatusAPIView.as_view(),
        name='check-vehicle-status'
    ),
    path(
        'reinspections/pending/',
        PendingReinspectionsAPIView.as_view(),
        name='pending-reinspections'
    ),
]