from django.core.management.base import BaseCommand

from machinery.models import MachineryType


MACHINERY_TYPES = [
    "Tipper",
    "Excavator",
    "Surface Miner",
    "Dozer",
    "Grader",
    "Wheel Loader",
    "Water Tanker",
    "Diesel Tanker",
    "Service Van",
    "Crane",
    "Drill Machine",
    "Tower Light",
    "Sky Lift",
    "Bus",
]


class Command(BaseCommand):
    help = "Seed Machinery Types"

    def handle(self, *args, **kwargs):

        for machine in MACHINERY_TYPES:

            MachineryType.objects.get_or_create(
                name=machine
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"{machine} added."
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "\nMachinery Types Seeded Successfully."
            )
        )