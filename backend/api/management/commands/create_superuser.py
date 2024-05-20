from django.core.management.base import BaseCommand
from api.models import User


class Command(BaseCommand):
    help = "Create a superuser"

    def handle(self, *args, **options):
        code = input("Enter the code for the superuser: ")
        name = input("Enter the name for the superuser: ")
        last_name = input("Enter the last name for the superuser: ")
        email = input("Enter the email for the superuser: ")
        password = input("Enter the password for the superuser: ")

        try:
            user = User.objects.create_superuser(
                code=code,
                name=name,
                last_name=last_name,
                email=email,
                password=password,
                role=User.ADMIN,
                status=True,
            )
            self.stdout.write(
                self.style.SUCCESS(f"Superuser {user.code} created successfully.")
            )
        except Exception as e:
            self.stderr.write(self.style.ERROR(str(e)))
