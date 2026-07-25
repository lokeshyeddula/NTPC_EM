from rest_framework import serializers

from .models import (
    MachineryInspectionField,
    InspectionLog,
    InspectionResult,
)


class MachineryInspectionFieldSerializer(serializers.ModelSerializer):
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

    result = serializers.ChoiceField(
        choices=["Pass", "Fail"]
    )


class InspectionHistorySerializer(serializers.ModelSerializer):
    vehicle = serializers.CharField(
        source="vehicle.machine_number",
        read_only=True,
    )

    # NEW: Pull the machinery type name via the vehicle relationship
    machinery_type = serializers.CharField(
        source="vehicle.machinery_type.name",
        read_only=True,
    )

    engineer = serializers.CharField(
        source="engineer.full_name",
        read_only=True,
    )

    # NEW: Custom field to extract only the failed checklist items
    failed_items = serializers.SerializerMethodField()

    class Meta:
        model = InspectionLog

        fields = (
            "id",
            "inspection_number",
            "inspection_date",
            "shift",
            "relay",
            "vehicle",
            "machinery_type",  # Added to fields
            "engineer",
            "operational_status",
            "operator_name",
            "operator_employee_id",
            "operator_agency",
            "operator_mobile",
            "operator_checklist_filled",
            "remarks",
            "failed_items",  # Added to fields
        )

    def get_failed_items(self, obj):
        # We loop through the prefetched results and return the names of the failed fields
        return [
            res.inspection_field.field_name
            for res in obj.results.all()
            if res.result.lower() == "fail"
        ]


class InspectionCreateSerializer(serializers.Serializer):
    relay = serializers.CharField()

    vehicle = serializers.IntegerField()

    operational_status = serializers.ChoiceField(
        choices=["Fit", "Unfit"]
    )

    operator_name = serializers.CharField()

    operator_employee_id = serializers.CharField()

    operator_agency = serializers.CharField()

    operator_mobile = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    operator_checklist_filled = serializers.BooleanField()

    operator_remarks = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    remarks = serializers.CharField(
        allow_blank=True,
        required=False,
    )

    # NEW FIELDS FOR REINSPECTION LOGIC
    is_reinspection = serializers.BooleanField(
        required=False,
        default=False
    )

    parent_inspection_id = serializers.IntegerField(
        required=False,
        allow_null=True
    )

    results = InspectionResultSerializer(
        many=True
    )

    def validate(self, attrs):
        failed = any(
            item["result"] == "Fail"
            for item in attrs.get("results", [])
        )

        if failed and not attrs.get("remarks"):
            raise serializers.ValidationError(
                {
                    "remarks":
                        "Remarks are mandatory when any checklist item fails."
                }
            )

        return attrs

    def create(self, validated_data):
        results_data = validated_data.pop("results")

        # Pop out the new fields before passing to kwargs to avoid field errors
        is_reinspection = validated_data.pop("is_reinspection", False)
        parent_inspection_id = validated_data.pop("parent_inspection_id", None)

        inspection_log = InspectionLog.objects.create(
            **validated_data
        )

        bulk_results = [
            InspectionResult(
                inspection=inspection_log,
                inspection_field_id=item["inspection_field"],
                result=item["result"],
            )
            for item in results_data
        ]

        InspectionResult.objects.bulk_create(
            bulk_results
        )

        return inspection_log