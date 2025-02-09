import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Input,
  VStack,
  Box,
  Heading,
  Field,
  Fieldset,
  createListCollection,
  Container,
} from "@chakra-ui/react";
import {
  SelectRoot,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { addressService } from "@/services/AddressService";
import { customerService } from "@/services/CustomerService";
import { Country, State, City } from "@/types/address";

const frameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
});

const CreateCustomerPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const frameworks = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const response = await addressService.getCountries();
    if (response.status === 200) {
      setCountries(response.data);
    }
  };

  const fetchStates = async (countryId: number) => {
    const response = await addressService.getStatesByCountry(countryId);
    if (response.status === 200) {
      setStates(response.data);
      setSelectedState(null);
      setCities([]);
    }
  };

  const fetchCities = async (stateId: number) => {
    const response = await addressService.getCitiesByState(stateId);
    if (response.status === 200) {
      setCities(response.data);
      setSelectedCity(null);
    }
  };

  const handleSubmit = async () => {
    const customerData = {
      name,
      email,
      phone,
      addresses: {
        city: selectedCity,
        street,
        postal_code: postalCode,
      },
    };

    const response = await customerService.create(customerData);
    if (response.status === 201) {
      alert("Customer created successfully!");
      // TODO: redirect or reset form here
    } else {
      alert("Error creating customer.");
    }
  };

  return (
    <Container maxW={"4xl"} p={4}>
      <Heading as="h1" size="xl" mb={5}>
        Create Customer
      </Heading>

      <VStack gap={4} align="stretch">
        {/* Customer Info */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input placeholder="Enter name" w="full" />
            </Field.Root>
          </Box>

          <Box>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input placeholder="Enter email" w="full" />
            </Field.Root>
          </Box>
        </Grid>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Field.Root>
              <Field.Label>Phone</Field.Label>
              <Input placeholder="Enter phone" w="full" />
            </Field.Root>
          </Box>
          <Box></Box>
        </Grid>

        {/* Address Section */}
        <Fieldset.Root>
          <Fieldset.Legend as="h3" fontWeight="semibold" fontSize="lg" mt={4}>
            Addresses
          </Fieldset.Legend>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Box>
              <SelectRoot size="md" collection={frameworks}>
                <SelectLabel>Country</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((country) => (
                    <SelectItem
                      key={country.value}
                      item={country}
                      onChange={(e) => {
                        const countryId = Number(e.target.value);
                        setSelectedCountry(countryId);
                        fetchStates(countryId);
                      }}
                    >
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Box>

            <Box>
              <SelectRoot size="md" collection={frameworks} disabled={!selectedCountry}>
                <SelectLabel>State</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((state) => (
                    <SelectItem
                      key={state.value}
                      item={state}
                      onChange={(e) => {
                        const stateId = Number(e.target.value);
                        setSelectedState(stateId);
                        fetchCities(stateId);
                      }}
                    >
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Box>
          </Grid>

          <SelectRoot size="md" collection={frameworks} disabled={!selectedState}>
            <SelectLabel>City</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.items.map((city) => (
                <SelectItem
                  key={city.value}
                  item={city}
                  onChange={(e) => setSelectedCity(Number(e.target.value))}
                >
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Box>
              <Field.Root>
                <Field.Label>Street</Field.Label>
                <Input placeholder="Enter street" w="full" />
              </Field.Root>
            </Box>

            <Box>
              <Field.Root>
                <Field.Label>Postal Code</Field.Label>
                <Input placeholder="Enter postal code" w="full" />
              </Field.Root>
            </Box>
          </Grid>
        </Fieldset.Root>

        {/* Submit Button */}
        <Button w="full" mt={4}>
          Create Customer
        </Button>
      </VStack>
    </Container>
  );
};

export default CreateCustomerPage;
