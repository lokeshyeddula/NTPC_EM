from rest_framework import serializers

from inspections.models import InspectionLog


class ShiftReportSerializer(serializers.ModelSerializer):

    vehicle = serializers.CharField(
        source="vehicle.machine_number"
    )

    engineer = serializers.CharField(
        source="engineer.full_name"
    )

    class Meta:

        model = InspectionLog

        fields = [

            "id",

            "inspection_number",

            "inspection_date",

            "shift",

            "relay",

            "vehicle",

            "engineer",

            "operational_status",

        ]
class InspectionResultReportSerializer(serializers.Serializer):

    field_name = serializers.CharField()

    result = serializers.CharField()
class InspectionReportSerializer(serializers.ModelSerializer):

    results = serializers.SerializerMethodField()

    engineer = serializers.CharField(
        source="engineer.full_name",
        read_only=True,
    )

    designation = serializers.CharField(
        source="engineer.designation",
        read_only=True,
    )

    vehicle = serializers.CharField(
        source="vehicle.machine_number",
        read_only=True,
    )

    machinery_type = serializers.CharField(
        source="vehicle.machinery_type.name",
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

            "engineer",

            "designation",

            "vehicle",

            "machinery_type",

            "operational_status",

            "remarks",

            "results",

        )

    def get_results(self, obj):

        return [

            {
                "field_name": item.inspection_field.field_name,
                "result": item.result,
            }

            for item in obj.results.select_related(
                "inspection_field"
            )

        ]