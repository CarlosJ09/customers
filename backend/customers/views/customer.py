from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Customer, Country, State, City, Address
from ..serializers import (
    CustomerSerializer,
    CountrySerializer,
    StateSerializer,
    CitySerializer,
    AddressSerializer,
)


class BaseViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
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

    @action(detail=False, methods=["get"])
    def by_country(self, request):
        """Get states filtered by country ID"""
        country_id = request.query_params.get("country_id")
        if not country_id:
            return Response({"error": "country_id is required"}, status=400)

        states = State.objects.filter(country_id=country_id)
        serializer = self.get_serializer(states, many=True)
        return Response(serializer.data)


class CityViewSet(BaseViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    @action(detail=False, methods=["get"])
    def by_state(self, request):
        """Get cities filtered by state ID"""
        state_id = request.query_params.get("state_id")
        if not state_id:
            return Response({"error": "state_id is required"}, status=400)

        cities = City.objects.filter(state_id=state_id)
        serializer = self.get_serializer(cities, many=True)
        return Response(serializer.data)


class AddressViewSet(BaseViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
