from django.contrib import admin

from .models import MachineryType, Vehicle


@admin.register(MachineryType)
class MachineryTypeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "machine_number",
        "machinery_type",
        "status",
    )

    list_filter = (
        "machinery_type",
        "status",
    )

    search_fields = (
        "machine_number",
    )

    ordering = (
        "machine_number",
    )