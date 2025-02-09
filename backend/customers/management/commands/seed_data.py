from django.core.management.base import BaseCommand
from customers.models import Country, State, City

DATA = [
    {
        "country": {"name": "United States", "code": "USA"},
        "states": [
            {
                "name": "California",
                "cities": ["Los Angeles", "San Francisco", "San Diego"],
            },
            {"name": "Texas", "cities": ["Houston", "Dallas", "Austin"]},
        ],
    },
    {
        "country": {"name": "Dominican Republic", "code": "DOM"},
        "states": [
            {"name": "Distrito Nacional", "cities": ["Santo Domingo"]},
            {"name": "Santiago", "cities": ["Santiago de los Caballeros"]},
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds the database with countries, states, and cities"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding database..."))

        for entry in DATA:
            country_data = entry["country"]
            country, _ = Country.objects.get_or_create(
                name=country_data["name"], code=country_data["code"]
            )

            for state_data in entry["states"]:
                state, _ = State.objects.get_or_create(
                    name=state_data["name"], country=country
                )

                for city_name in state_data["cities"]:
                    City.objects.get_or_create(name=city_name, state=state)

        self.stdout.write(self.style.SUCCESS("Successfully seeded database!"))
