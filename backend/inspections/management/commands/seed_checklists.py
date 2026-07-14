from django.core.management.base import BaseCommand

from inspections.checklist_data import CHECKLIST_MAPPING
from inspections.models import (
    InspectionField,
    MachineryInspectionField,
)

from machinery.models import MachineryType


class Command(BaseCommand):
    help = "Seed Inspection Fields and Machinery Mapping"

    def handle(self, *args, **kwargs):

        created_fields = 0
        created_mapping = 0

        for machine_name, fields in CHECKLIST_MAPPING.items():

            machinery_type = MachineryType.objects.get(
                name=machine_name
            )

            order = 1

            for field_name in fields:

                inspection_field, field_created = (
                    InspectionField.objects.get_or_create(
                        field_name=field_name,
                        defaults={
                            "display_order": order,
                            "is_active": True,
                        },
                    )
                )

                if field_created:
                    created_fields += 1

                _, mapping_created = (
                    MachineryInspectionField.objects.get_or_create(
                        machinery_type=machinery_type,
                        inspection_field=inspection_field,
                        defaults={
                            "display_order": order,
                        },
                    )
                )

                if mapping_created:
                    created_mapping += 1

                order += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nInspection Fields Created : {created_fields}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Checklist Mappings Created : {created_mapping}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "\nChecklist Seed Completed Successfully."
            )
        )