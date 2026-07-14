from django.utils import timezone

from .models import InspectionLog


def generate_inspection_number():

    today = timezone.now().strftime("%Y%m%d")

    count = (
        InspectionLog.objects.filter(
            inspection_date=timezone.now().date()
        ).count()
        + 1
    )

    return f"INSP-{today}-{count:04d}"