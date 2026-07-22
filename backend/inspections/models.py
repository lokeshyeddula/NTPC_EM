from django.db import models
from django.utils import timezone

from accounts.models import User
from machinery.models import MachineryType, Vehicle


class InspectionField(models.Model):

    field_name = models.CharField(max_length=200, unique=True)

    display_order = models.PositiveIntegerField(default=1)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "inspection_fields"
        ordering = ["display_order"]

    def __str__(self):
        return self.field_name


class MachineryInspectionField(models.Model):

    machinery_type = models.ForeignKey(
        MachineryType,
        on_delete=models.CASCADE,
        related_name="inspection_fields",
    )

    inspection_field = models.ForeignKey(
        InspectionField,
        on_delete=models.CASCADE,
    )

    display_order = models.PositiveIntegerField(default=1)

    class Meta:

        db_table = "machinery_inspection_fields"

        ordering = [
            "machinery_type",
            "display_order",
        ]

        unique_together = (
            "machinery_type",
            "inspection_field",
        )

    def __str__(self):
        return f"{self.machinery_type.name} - {self.inspection_field.field_name}"


class InspectionLog(models.Model):

    SHIFT_CHOICES = (
        ("Morning", "Morning"),
        ("Evening", "Evening"),
        ("Night", "Night"),
    )

    RELAY_CHOICES = (
        ("Relay A", "Relay A"),
        ("Relay B", "Relay B"),
        ("Relay C", "Relay C"),
        ("Relay D", "Relay D"),
        ("General Shift", "General Shift"),
    )

    STATUS_CHOICES = (
        ("Fit", "Fit"),
        ("Unfit", "Unfit"),
    )

    inspection_number = models.CharField(
        max_length=30,
        unique=True,
    )

    inspection_date = models.DateField(
        default=timezone.now,
    )

    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
    )

    relay = models.CharField(
        max_length=30,
        choices=RELAY_CHOICES,
    )

    engineer = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
    )

    operational_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
    )

    operator_name = models.CharField(
        max_length=150,
        blank=True,
        default="",
    )

    operator_employee_id = models.CharField(
        max_length=50,
        blank=True,
        default="",
    )

    operator_agency = models.CharField(
        max_length=150,
        blank=True,
        default="",
    )

    operator_mobile = models.CharField(
        max_length=10,
        blank=True,
        default="",
    )

    operator_checklist_filled = models.BooleanField(
        default=False,
    )
    operator_remarks = models.TextField(
        blank=True,
        default=""
    )

    remarks = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        db_table = "inspection_logs"

        ordering = [
            "-inspection_date",
            "-created_at",
        ]

    def __str__(self):
        return self.inspection_number


class InspectionResult(models.Model):

    RESULT_CHOICES = (
        ("Pass", "Pass"),
        ("Fail", "Fail"),
    )

    inspection = models.ForeignKey(
        InspectionLog,
        on_delete=models.CASCADE,
        related_name="results",
    )

    inspection_field = models.ForeignKey(
        InspectionField,
        on_delete=models.PROTECT,
    )

    result = models.CharField(
        max_length=10,
        choices=RESULT_CHOICES,
    )

    class Meta:

        db_table = "inspection_results"

        unique_together = (
            "inspection",
            "inspection_field",
        )

    def __str__(self):
        return f"{self.inspection.inspection_number} - {self.inspection_field.field_name}"