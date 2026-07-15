from django.urls import path

from .views import (
    MachineryChecklistAPIView,
    InspectionCreateAPIView,
)

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

]