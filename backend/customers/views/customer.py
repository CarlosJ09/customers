from rest_framework import viewsets, filters, status
from django.db.models import Count, F
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action, api_view
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
from django.http import HttpResponse
import pandas as pd
import io


class BaseViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CustomerViewSet(BaseViewSet):
    queryset = Customer.objects.all().order_by("-created_at")
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

    @action(detail=False, methods=["post"])
    def bulk_delete(self, request):
        customer_ids = request.data.get("customer_ids", [])

        if not customer_ids:
            return Response(
                {"error": "No customer IDs provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count, _ = Customer.objects.filter(id__in=customer_ids).delete()

        if deleted_count > 0:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"error": "No customers found with the provided IDs."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["get"])
    def generate_report(self, request):
        """Generate an Excel report for all customers with multiple address handling"""
        customers = self.get_queryset()
        format_type = request.query_params.get("format", "separate_rows")

        if format_type == "separate_rows":

            customer_data = []
            for customer in customers:
                addresses = customer.addresses.all()
                if addresses.exists():
                    for address in addresses:
                        customer_data.append(
                            {
                                "Customer ID": customer.id,
                                "Name": customer.name,
                                "Email": customer.email,
                                "Phone": customer.phone or "",
                                "Created At": customer.created_at.strftime(
                                    "%Y-%m-%d %H:%M:%S"
                                ),
                                "Address ID": address.id,
                                "Street": address.street,
                                "City": address.city.name,
                                "State": address.city.state.name,
                                "Country": address.city.state.country.name,
                                "Zip Code": address.zip_code or "",
                            }
                        )
                else:

                    customer_data.append(
                        {
                            "Customer ID": customer.id,
                            "Name": customer.name,
                            "Email": customer.email,
                            "Phone": customer.phone or "",
                            "Created At": customer.created_at.strftime(
                                "%Y-%m-%d %H:%M:%S"
                            ),
                            "Address ID": "",
                            "Street": "",
                            "City": "",
                            "State": "",
                            "Country": "",
                            "Zip Code": "",
                        }
                    )
        else:

            customer_data = []
            for customer in customers:
                addresses = customer.addresses.all()
                addresses_info = []
                cities = []
                states = []
                countries = []
                zip_codes = []

                if addresses.exists():
                    for address in addresses:
                        addresses_info.append(address.street)
                        cities.append(address.city.name)
                        states.append(address.city.state.name)
                        countries.append(address.city.state.country.name)
                        zip_codes.append(address.zip_code or "")

                customer_data.append(
                    {
                        "Customer ID": customer.id,
                        "Name": customer.name,
                        "Email": customer.email,
                        "Phone": customer.phone or "",
                        "Created At": customer.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        "Streets": " | ".join(addresses_info) if addresses_info else "",
                        "Cities": " | ".join(cities) if cities else "",
                        "States": " | ".join(states) if states else "",
                        "Countries": " | ".join(countries) if countries else "",
                        "Zip Codes": " | ".join(zip_codes) if zip_codes else "",
                    }
                )

        df = pd.DataFrame(customer_data)

        excel_file = io.BytesIO()

        with pd.ExcelWriter(excel_file, engine="xlsxwriter") as writer:
            df.to_excel(writer, index=False, sheet_name="Customers")

            worksheet = writer.sheets["Customers"]

            for idx, col in enumerate(df.columns):
                series = df[col]
                max_length = (
                    max(
                        series.astype(str).map(len).max(),
                        len(str(series.name)),
                    )
                    + 2
                )
                worksheet.set_column(idx, idx, max_length)

                if format_type == "combined" and col in [
                    "Streets",
                    "Cities",
                    "States",
                    "Countries",
                    "Zip Codes",
                ]:
                    worksheet.set_column(
                        idx,
                        idx,
                        max_length,
                        writer.book.add_format({"text_wrap": True}),
                    )

        excel_file.seek(0)

        response = HttpResponse(
            excel_file.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="customer_report.xlsx"'
        return response


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


@api_view(["GET"])
def dashboard_stats(request):
    customers_by_country = Customer.objects.values(
        country=F("addresses__city__state__country__name")
    ).annotate(count=Count("id", distinct=True))

    response_data = {
        "totalCustomers": Customer.objects.count(),
        "customersByCountry": list(customers_by_country),
    }

    return Response(response_data)
