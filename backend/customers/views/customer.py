from rest_framework import viewsets, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["name", "email"]
    search_fields = ["name", "email"]

    def get_queryset(self):
        queryset = super().get_queryset()
        country_id = self.request.query_params.get("country_id")
        state_id = self.request.query_params.get("state_id")

        if country_id:
            queryset = queryset.filter(addresses__city__state__country_id=country_id)
        if state_id:
            queryset = queryset.filter(addresses__city__state_id=state_id)

        return queryset


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
