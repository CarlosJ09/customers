from django.contrib import admin
from .models import Customer, Country, State, City, Address

admin.site.register(Customer)
admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Address)
