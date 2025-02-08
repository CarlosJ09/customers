from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Customer, Country, State, City, Address
from ..serializers import (
    CustomerSerializer,
    CountrySerializer,
    StateSerializer,
    CitySerializer,
    AddressSerializer,
)


class BearerTokenAuthentication(TokenAuthentication):
    keyword = "Bearer"


class BaseViewSet(viewsets.ModelViewSet):
    authentication_classes = [BearerTokenAuthentication]
    permission_classes = [IsAuthenticated]


class CustomerViewSet(BaseViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CountryViewSet(BaseViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class StateViewSet(BaseViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer


class CityViewSet(BaseViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class AddressViewSet(BaseViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
