from pathlib import Path

import pandas as pd
from django.core.management.base import BaseCommand

from machinery.models import MachineryType, Vehicle


CATEGORY_MAP = {
    "TIPPERS": "Tipper",
    "EXCAVATORS": "Excavator",
    "SURFACE MINER": "Surface Miner",
    "DOZER": "Dozer",
    "GRADER": "Grader",
    "WHEEL LOADER": "Wheel Loader",
    "WATER TANKER": "Water Tanker",
    "DIESEL TANKER": "Diesel Tanker",
    "DIESEL BOWSER": "Diesel Tanker",
    "SERVICE VAN": "Service Van",
    "HYDRA CRANE": "Crane",
    "CRANE": "Crane",
    "SKY LIFT": "Sky Lift",
    "BUS": "Bus",
    "VAN": "Van",
}


class Command(BaseCommand):
    help = "Import vehicles from Excel"

    def handle(self, *args, **kwargs):

        file_path = Path("vehicle_door_numbers.xlsx")

        if not file_path.exists():
            self.stdout.write(
                self.style.ERROR("Excel file not found.")
            )
            return

        df = pd.read_excel(file_path)

        df.columns = df.columns.str.strip()

        df = df.dropna(subset=["ASSET CATEGORY", "DOOR NO"])

        imported = 0
        skipped = 0

        for _, row in df.iterrows():

            category = str(row["ASSET CATEGORY"]).strip().upper()
            make_model = str(row["MAKE & MODEL"]).strip()
            machine_number = str(row["DOOR NO"]).strip()

            machinery_name = CATEGORY_MAP.get(category)

            if machinery_name is None:
                skipped += 1
                continue

            machinery_type, _ = MachineryType.objects.get_or_create(
                name=machinery_name
            )

            _, created = Vehicle.objects.get_or_create(
                machine_number=machine_number,
                defaults={
                    "machinery_type": machinery_type,
                    "make_model": make_model,
                    "status": "Active",
                },
            )

            if created:
                imported += 1

        self.stdout.write(
            self.style.SUCCESS(f"Imported : {imported}")
        )

        self.stdout.write(
            self.style.WARNING(f"Skipped : {skipped}")
        )