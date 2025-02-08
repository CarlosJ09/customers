from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.customer import (
    CustomerViewSet,
    CountryViewSet,
    StateViewSet,
    CityViewSet,
    AddressViewSet,
)
from .views.auth import RegisterUserView, LoginUserView, LogoutUserView

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)
router.register(r"countries", CountryViewSet)
router.register(r"states", StateViewSet)
router.register(r"cities", CityViewSet)
router.register(r"addresses", AddressViewSet)

urlpatterns = [
    path("auth/register/", RegisterUserView.as_view(), name="register"),
    path("auth/login/", LoginUserView.as_view(), name="login"),
    path("auth/logout/", LogoutUserView.as_view(), name="logout"),
    path("", include(router.urls)),
]
