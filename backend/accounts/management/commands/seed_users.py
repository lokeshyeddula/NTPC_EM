from django.core.management.base import BaseCommand

from accounts.models import User

DEFAULT_PASSWORD = "Welcome@123"


USERS = [
    ("102290", "Sh. Manish Kumar", "Colliery Engineer", True),
    ("41707", "Sh. Bikas Kr. Biswas", "Manager (Min)", False),
    ("254810", "Sh. Priyabarta Pradhan", "Sr. Asst. Engineer (Elec.)", False),
    ("620537", "Sh. Molli Praveen Kumar", "Mechanical Engineer", False),
    ("620539", "Sh. Subhadeep Ghosh", "Mechanical Engineer", False),
    ("91300013", "Sh. Rahul Kr. Thakur", "Electrical Supervisor", False),
    ("620533", "Sh. Sujeet Kumar", "Electrical Supervisor", False),
    ("990132", "Sh. Anurag Kumar", "Mechanical Supervisor", False),
    ("91300035", "Sh. Amit Kumari Tiwari", "Electrical Supervisor", False),
    ("990026", "Sh. Jaipal Singh", "Mechanical Supervisor", False),
    ("990139", "Sh. Abhay Singh", "Mechanical Supervisor (E&M)", False),
    ("620538", "Sh. Arbind Bauri", "Mechanical Engineer (E&M)", False),
    ("990021", "Sh. Safal Lenus Topno", "Mechanical Supervisor", False),
]


class Command(BaseCommand):
    help = "Seed NTPC users"

    def handle(self, *args, **kwargs):

        created = 0

        for emp_id, full_name, designation, is_admin in USERS:

            if User.objects.filter(emp_id=emp_id).exists():
                self.stdout.write(
                    self.style.WARNING(f"{emp_id} already exists.")
                )
                continue

            user = User.objects.create(
                emp_id=emp_id,
                full_name=full_name,
                designation=designation,
                department="E&M",
                is_admin=is_admin,
                is_staff=is_admin,
                is_superuser=is_admin,
                is_active=True,
                is_first_login=True,
            )

            user.set_password(DEFAULT_PASSWORD)
            user.save()

            created += 1

            self.stdout.write(
                self.style.SUCCESS(f"Created {emp_id} - {full_name}")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully created {created} users."
            )
        )