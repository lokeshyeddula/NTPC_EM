from rest_framework import serializers

from .models import (
    MachineryInspectionField,
    InspectionLog,
    InspectionResult,
)


class MachineryInspectionFieldSerializer(
    serializers.ModelSerializer
):

    id = serializers.ReadOnlyField(
        source="inspection_field.id"
    )

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


class InspectionResultSerializer(
    serializers.Serializer
):

    inspection_field = serializers.IntegerField()

    result = serializers.ChoiceField(
        choices=[
            "Pass",
            "Fail",
        ]
    )


class InspectionHistorySerializer(
    serializers.ModelSerializer
):

    vehicle = serializers.CharField(
        source="vehicle.machine_number",
        read_only=True,
    )

    machinery_type = serializers.CharField(
        source="vehicle.machinery_type.name",
        read_only=True,
    )

    engineer = serializers.CharField(
        source="engineer.full_name",
        read_only=True,
    )

    failed_items = serializers.SerializerMethodField()

    parent_inspection_number = serializers.CharField(
        source="parent_inspection.inspection_number",
        read_only=True,
        allow_null=True,
    )

    is_reinspection = serializers.SerializerMethodField()

    class Meta:
        model = InspectionLog

        fields = (
            "id",
            "inspection_number",
            "inspection_date",
            "shift",
            "relay",
            "vehicle",
            "machinery_type",
            "engineer",
            "operational_status",
            "operator_name",
            "operator_employee_id",
            "operator_agency",
            "operator_mobile",
            "operator_checklist_filled",
            "operator_remarks",
            "remarks",
            "failed_items",
            "parent_inspection_number",
            "is_reinspection",
        )

    def get_failed_items(self, obj):

        return [
            result.inspection_field.field_name
            for result in obj.results.all()
            if result.result.lower() == "fail"
        ]

    def get_is_reinspection(self, obj):

        return obj.parent_inspection_id is not None


class InspectionCreateSerializer(
    serializers.Serializer
):

    relay = serializers.CharField()

    vehicle = serializers.IntegerField()

    operational_status = serializers.ChoiceField(
        choices=[
            "Fit",
            "Unfit",
        ]
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
        required=False,
        allow_blank=True,
    )

    # =====================================================
    # RE-INSPECTION
    # =====================================================

    is_reinspection = serializers.BooleanField(
        required=False,
        default=False,
    )

    parent_inspection_id = serializers.IntegerField(
        required=False,
        allow_null=True,
        default=None,
    )

    results = InspectionResultSerializer(
        many=True
    )

    def validate(self, attrs):

        results = attrs.get(
            "results",
            []
        )

        failed = any(
            item["result"] == "Fail"
            for item in results
        )

        if failed and not attrs.get("remarks"):

            raise serializers.ValidationError(
                {
                    "remarks":
                    "Remarks are mandatory when any checklist item fails."
                }
            )

        # =================================================
        # RE-INSPECTION VALIDATION
        # =================================================

        is_reinspection = attrs.get(
            "is_reinspection",
            False,
        )

        parent_id = attrs.get(
            "parent_inspection_id"
        )

        if is_reinspection:

            if not parent_id:

                raise serializers.ValidationError(
                    {
                        "parent_inspection_id":
                        "Parent inspection is required for re-inspection."
                    }
                )

            try:

                parent = InspectionLog.objects.get(
                    id=parent_id
                )

            except InspectionLog.DoesNotExist:

                raise serializers.ValidationError(
                    {
                        "parent_inspection_id":
                        "Original inspection not found."
                    }
                )

            # Parent must belong to same vehicle

            if parent.vehicle_id != attrs["vehicle"]:

                raise serializers.ValidationError(
                    {
                        "parent_inspection_id":
                        "Original inspection does not belong to this vehicle."
                    }
                )

            # Parent must be UNFIT

            if parent.operational_status != "Unfit":

                raise serializers.ValidationError(
                    {
                        "parent_inspection_id":
                        "Only an Unfit inspection can be re-inspected."
                    }
                )

        return attrs