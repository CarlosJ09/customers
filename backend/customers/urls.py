from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.customer import (
    CustomerViewSet,
    CountryViewSet,
    StateViewSet,
    CityViewSet,
    AddressViewSet,
    dashboard_stats,
)
from .views.auth import (
    RegisterUserView,
    LoginUserView,
    LogoutUserView,
    RefreshTokenView,
)

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)
router.register(r"countries", CountryViewSet)
router.register(r"states", StateViewSet)
router.register(r"cities", CityViewSet)
router.register(r"addresses", AddressViewSet)

urlpatterns = [
    path("auth/register/", RegisterUserView.as_view(), name="register"),
    path("auth/login/", LoginUserView.as_view(), name="login"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutUserView.as_view(), name="logout"),
    path("dashboard/", dashboard_stats, name="dashboard_stats"),
    path("", include(router.urls)),
]
