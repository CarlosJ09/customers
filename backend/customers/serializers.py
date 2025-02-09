from rest_framework import serializers
from .models import Customer, Address, City, State, Country


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class StateSerializer(serializers.ModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = State
        fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
    state = StateSerializer()

    class Meta:
        model = City
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), write_only=True
    )
    city_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Address
        fields = ["street", "city", "zip_code", "city_detail"]

    def get_city_detail(self, obj):
        return CitySerializer(obj.city).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")

        if request and request.method in ["GET"]:
            data["city"] = data.pop("city_detail")
        else:
            data.pop("city_detail", None)

        return data


class CustomerSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True)

    class Meta:
        model = Customer
        fields = "__all__"

    def create(self, validated_data):
        addresses_data = validated_data.pop("addresses")
        customer = Customer.objects.create(**validated_data)
        for address_data in addresses_data:
            Address.objects.create(customer=customer, **address_data)
        return customer
