import uuid

from django.utils import timezone


def generate_inspection_number():
    today = timezone.localdate().strftime("%Y%m%d")

    unique_code = uuid.uuid4().hex[:8].upper()

    return f"INSP-{today}-{unique_code}"