from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet,
    CountryViewSet,
    StateViewSet,
    CityViewSet,
    AddressViewSet,
)

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)
router.register(r"countries", CountryViewSet)
router.register(r"states", StateViewSet)
router.register(r"cities", CityViewSet)
router.register(r"addresses", AddressViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
