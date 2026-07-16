from rest_framework import serializers
from .models import (
    InspectionField,
    MachineryInspectionField,
    InspectionLog,
    InspectionResult,
)


class MachineryInspectionFieldSerializer(serializers.ModelSerializer):
    # Explicitly pull the target InspectionField ID so the frontend maps it correctly
    id = serializers.ReadOnlyField(source="inspection_field.id")
    field_name = serializers.CharField(
        source="inspection_field.field_name",
        read_only=True,
    )

    class Meta:
        model = MachineryInspectionField
        fields = (
            "id",
            "field_name",
            "display_order",
        )


class InspectionResultSerializer(serializers.Serializer):
    inspection_field = serializers.IntegerField()
    result = serializers.ChoiceField(choices=["Pass", "Fail"])

class InspectionHistorySerializer(serializers.ModelSerializer):

    vehicle = serializers.CharField(
        source="vehicle.machine_number",
        read_only=True,
    )

    engineer = serializers.CharField(
        source="engineer.full_name",
        read_only=True,
    )

    class Meta:

        model = InspectionLog

        fields = (

            "id",

            "inspection_number",

            "inspection_date",

            "shift",

            "relay",

            "vehicle",

            "engineer",

            "operational_status",

        )
class InspectionCreateSerializer(serializers.Serializer):
    relay = serializers.CharField()
    vehicle = serializers.IntegerField()

    # Updated to match the exact strings sent by the React frontend
    operational_status = serializers.ChoiceField(choices=["Fit", "Unfit"])

    remarks = serializers.CharField(allow_blank=True, required=False)
    results = InspectionResultSerializer(many=True)

    def validate(self, attrs):
        # Use .get() with a default empty list as a safety fallback
        failed = any(item["result"] == "Fail" for item in attrs.get("results", []))

        if failed and not attrs.get("remarks"):
            raise serializers.ValidationError({
                "remarks": "Remarks are mandatory when any checklist item fails."
            })

        return attrs

    def create(self, validated_data):
        """
        Since this is a standard Serializer, you must implement create()
        to handle the nested write operations.
        """
        # 1. Pop the nested results data
        results_data = validated_data.pop("results")

        # 2. Create the parent InspectionLog instance
        inspection_log = InspectionLog.objects.create(**validated_data)

        # 3. Create the child InspectionResult instances efficiently using bulk_create
        bulk_results = [
            InspectionResult(
                inspection_log=inspection_log,
                inspection_field_id=item["inspection_field"],
                result=item["result"]
            )
            for item in results_data
        ]
        InspectionResult.objects.bulk_create(bulk_results)

        return inspection_log