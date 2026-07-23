from celery import shared_task

from alerts.alert_manager import process_alerts
from inspections.models import InspectionLog


@shared_task
def send_failure_email_task(inspection_id):

    inspection = (
        InspectionLog.objects
        .select_related(
            "engineer",
            "vehicle",
            "vehicle__machinery_type",
        )
        .prefetch_related(
            "results",
            "results__inspection_field",
        )
        .get(id=inspection_id)
    )

    process_alerts(
        inspection
    )