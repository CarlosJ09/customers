import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Input,
  VStack,
  Box,
  Field,
  Fieldset,
  createListCollection,
  ListCollection,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import {
  SelectRoot,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { addressService } from "@/services/AddressService";
import { Toaster, toaster } from "@/components/ui/toaster";

const initListCollection = createListCollection({
  items: [],
});

interface Address {
  id: number;
  countryId: number | null;
  stateId: number | null;
  cityId: number | null;
  street: string;
  zip_code: string;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
}

const INITIAL_FORM_DATA: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  addresses: [
    {
      id: 1,
      countryId: null,
      stateId: null,
      cityId: null,
      street: "",
      zip_code: "",
    },
  ],
};

export const CustomerForm = ({
  initialData = INITIAL_FORM_DATA,
  onSubmit,
  submitButtonText,
  isLoading = false,
}: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);
  const [countries, setCountries] = useState<ListCollection>(initListCollection);
  const [statesByCountry, setStatesByCountry] = useState<Record<number, ListCollection>>({});
  const [citiesByState, setCitiesByState] = useState<Record<number, ListCollection>>({});

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    // Fetch states and cities for existing addresses on edit
    if (initialData !== INITIAL_FORM_DATA) {
      initialData.addresses.forEach(async (address) => {
        if (address.countryId) {
          await fetchStates(address.countryId);
        }
        if (address.stateId) {
          await fetchCities(address.stateId);
        }
      });
    }
  }, [initialData]);

  const fetchCountries = async () => {
    const response = await addressService.getCountries();
    if (response.status === 200) {
      const data = response.data.results.map((country) => ({
        label: country.name,
        value: country.id.toString(),
      }));
      const countriesCollection = createListCollection({ items: data });
      setCountries(countriesCollection);
    }
  };

  const fetchStates = async (countryId: number) => {
    if (statesByCountry[countryId]) return;

    const response = await addressService.getStatesByCountry(countryId);
    if (response.status === 200) {
      const data = response.data.map((state) => ({
        label: state.name,
        value: state.id.toString(),
      }));
      const statesCollection = createListCollection({ items: data });
      setStatesByCountry((prev) => ({
        ...prev,
        [countryId]: statesCollection,
      }));
    }
  };

  const fetchCities = async (stateId: number) => {
    if (citiesByState[stateId]) return;

    const response = await addressService.getCitiesByState(stateId);
    if (response.status === 200) {
      const data = response.data.map((city) => ({
        label: city.name,
        value: city.id.toString(),
      }));
      const citiesCollection = createListCollection({ items: data });
      setCitiesByState((prev) => ({
        ...prev,
        [stateId]: citiesCollection,
      }));
    }
  };

  const updateFormField = (field: keyof CustomerFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAddress = () => {
    updateFormField("addresses", [
      ...formData.addresses,
      {
        id: Math.max(...formData.addresses.map((a) => a.id)) + 1,
        countryId: null,
        stateId: null,
        cityId: null,
        street: "",
        zip_code: "",
      },
    ]);
  };

  const removeAddress = (id: number) => {
    if (formData.addresses.length === 1) {
      toaster.error({ title: "At least one address is required" });
      return;
    }

    updateFormField(
      "addresses",
      formData.addresses.filter((address) => address.id !== id)
    );
  };

  const updateAddress = (id: number, updates: Partial<Address>) => {
    updateFormField(
      "addresses",
      formData.addresses.map((address) =>
        address.id === id ? { ...address, ...updates } : address
      )
    );
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <VStack gap={4} align="stretch">
      <Toaster />

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Box>
          <Field.Root required>
            <Field.Label>
              Name <Text color={"red"}>*</Text>
            </Field.Label>
            <Input
              value={formData.name}
              placeholder="Enter name"
              w="full"
              onChange={(e) => updateFormField("name", e.target.value)}
            />
          </Field.Root>
        </Box>

        <Box>
          <Field.Root required>
            <Field.Label>
              Email <Text color={"red"}>*</Text>
            </Field.Label>
            <Input
              value={formData.email}
              placeholder="Enter email"
              w="full"
              onChange={(e) => updateFormField("email", e.target.value)}
            />
          </Field.Root>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Box>
          <Field.Root>
            <Field.Label>Phone</Field.Label>
            <Input
              value={formData.phone}
              placeholder="Enter phone"
              w="full"
              onChange={(e) => updateFormField("phone", e.target.value)}
            />
          </Field.Root>
        </Box>
      </Grid>

      <Fieldset.Root>
        <HStack justify="space-between" align="center">
          <Fieldset.Legend as="h3" fontWeight="semibold" fontSize="lg" mt={4}>
            Addresses
          </Fieldset.Legend>
          <Button size="sm" onClick={addAddress}>
            <FiPlus /> Add Address
          </Button>
        </HStack>

        {formData.addresses.map((address) => (
          <Box
            key={address.id}
            position="relative"
            mt={4}
            py={8}
            px={4}
            borderWidth={1}
            borderRadius="md"
          >
            <IconButton
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => removeAddress(address.id)}
            >
              <FiTrash2 />
            </IconButton>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box>
                <SelectRoot
                  size="md"
                  collection={countries}
                  value={address.countryId ? [address.countryId.toString()] : []}
                  onValueChange={(country) => {
                    const countryId = Number(country.value[0]);
                    updateAddress(address.id, {
                      countryId,
                      stateId: null,
                      cityId: null,
                    });
                    fetchStates(countryId);
                  }}
                >
                  <SelectLabel>
                    <HStack gap={1}>
                      Country<Text color={"red"}>*</Text>
                    </HStack>
                  </SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.items.map((country) => (
                      <SelectItem key={country.value} item={country}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Box>

              <Box>
                <SelectRoot
                  size="md"
                  collection={
                    address.countryId
                      ? statesByCountry[address.countryId] || initListCollection
                      : initListCollection
                  }
                  value={address.stateId ? [address.stateId.toString()] : []}
                  onValueChange={(state) => {
                    const stateId = Number(state.value[0]);
                    updateAddress(address.id, {
                      stateId,
                      cityId: null,
                    });
                    fetchCities(stateId);
                  }}
                  disabled={!address.countryId}
                >
                  <SelectLabel>
                    <HStack gap={1}>
                      State<Text color={"red"}>*</Text>
                    </HStack>
                  </SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {(address.countryId ? statesByCountry[address.countryId]?.items || [] : []).map(
                      (state) => (
                        <SelectItem key={state.value} item={state}>
                          {state.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </SelectRoot>
              </Box>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={4}>
              <Box>
                <SelectRoot
                  size="md"
                  collection={
                    address.stateId
                      ? citiesByState[address.stateId] || initListCollection
                      : initListCollection
                  }
                  value={address.cityId ? [address.cityId.toString()] : []}
                  onValueChange={(city) => {
                    updateAddress(address.id, {
                      cityId: Number(city.value[0]),
                    });
                  }}
                  disabled={!address.stateId}
                >
                  <SelectLabel>
                    <HStack gap={1}>
                      City<Text color={"red"}>*</Text>
                    </HStack>
                  </SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {(address.stateId ? citiesByState[address.stateId]?.items || [] : []).map(
                      (city) => (
                        <SelectItem key={city.value} item={city}>
                          {city.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </SelectRoot>
              </Box>

              <Box>
                <Field.Root>
                  <Field.Label>
                    Street
                    <Text color={"red"}>*</Text>
                  </Field.Label>
                  <Input
                    value={address.street}
                    placeholder="Enter street"
                    w="full"
                    onChange={(e) => updateAddress(address.id, { street: e.target.value })}
                  />
                </Field.Root>
              </Box>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={4}>
              <Box>
                <Field.Root>
                  <Field.Label>Postal Code</Field.Label>
                  <Input
                    placeholder="Enter postal code"
                    w="full"
                    value={address.zip_code}
                    onChange={(e) => updateAddress(address.id, { zip_code: e.target.value })}
                  />
                </Field.Root>
              </Box>
            </Grid>
          </Box>
        ))}
      </Fieldset.Root>

      <Button maxW={"lg"} w="full" mt={4} mx={"auto"} onClick={handleSubmit} loading={isLoading}>
        {submitButtonText}
      </Button>
    </VStack>
  );
};
