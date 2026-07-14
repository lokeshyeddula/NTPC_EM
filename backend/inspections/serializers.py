from rest_framework import serializers

from .models import (
    InspectionField,
    MachineryInspectionField,
    InspectionLog,
    InspectionResult,
)


class MachineryInspectionFieldSerializer(serializers.ModelSerializer):

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


class InspectionCreateSerializer(serializers.Serializer):

    relay = serializers.CharField()

    vehicle = serializers.IntegerField()

    operational_status = serializers.ChoiceField(
        choices=["Fit", "Unfit"]
    )

    remarks = serializers.CharField(
        allow_blank=True,
        required=False,
    )

    results = InspectionResultSerializer(
        many=True
    )

    def validate(self, attrs):

        failed = any(
            item["result"] == "Fail"
            for item in attrs["results"]
        )

        if failed and not attrs.get("remarks"):
            raise serializers.ValidationError(
                {
                    "remarks":
                    "Remarks are mandatory when any checklist item fails."
                }
            )

        return attrs