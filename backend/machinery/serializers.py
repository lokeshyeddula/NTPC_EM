from rest_framework import serializers

from .models import MachineryType, Vehicle


class MachineryTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = MachineryType
        fields = "__all__"


class VehicleSerializer(serializers.ModelSerializer):

    machinery_type_name = serializers.CharField(
        source="machinery_type.name",
        read_only=True
    )

    class Meta:
        model = Vehicle
        fields = (
            "id",
            "machine_number",
            "machinery_type",
            "machinery_type_name",
            "status",
            "remarks",
        )