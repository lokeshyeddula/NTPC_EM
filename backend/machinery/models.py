from django.db import models


class MachineryType(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "machinery_types"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Vehicle(models.Model):

    STATUS_CHOICES = (
        ("Active", "Active"),
        ("Maintenance", "Maintenance"),
    )

    machinery_type = models.ForeignKey(
        MachineryType,
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    machine_number = models.CharField(
        max_length=50,
        unique=True,
    )

    make_model = models.CharField(
        max_length=200,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active",
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "vehicles"
        ordering = ["machine_number"]

    def __str__(self):
        return f"{self.machine_number} - {self.make_model}"