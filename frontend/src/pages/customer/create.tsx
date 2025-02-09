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
  ListCollection,
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

const initListCollection = createListCollection({
  items: [],
});

const CreateCustomerPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [countries, setCountries] = useState<ListCollection>(initListCollection);
  const [states, setStates] = useState<ListCollection>(initListCollection);
  const [cities, setCities] = useState<ListCollection>(initListCollection);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const response = await addressService.getCountries();
    if (response.status === 200) {
      const data = response.data.map((country) => ({
        label: country.name,
        value: country.id,
      }));
      const countriesCollection = createListCollection({ items: data });
      setCountries(countriesCollection);
    }
  };

  const fetchStates = async (countryId: number) => {
    const response = await addressService.getStatesByCountry(countryId);
    if (response.status === 200) {
      const data = response.data.map((state) => ({
        label: state.name,
        value: state.id,
      }));
      const statesCollection = createListCollection({ items: data });
      setStates(statesCollection);
      setCities(initListCollection);
      setSelectedState(null);
    }
  };

  const fetchCities = async (stateId: number) => {
    const response = await addressService.getCitiesByState(stateId);
    if (response.status === 200) {
      const data = response.data.map((city) => ({
        label: city.name,
        value: city.id,
      }));
      const citiesCollection = createListCollection({ items: data });
      setCities(citiesCollection);

      setSelectedCity(null);
    }
  };

  const handleSubmit = async () => {
    const customerData = {
      name,
      email,
      phone,
      addresses: [
        {
          city: selectedCity,
          street,
          postal_code: postalCode,
        },
      ],
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
              <Input
                value={name}
                placeholder="Enter name"
                w="full"
                onChange={(e) => setName(e.target.value)}
              />
            </Field.Root>
          </Box>

          <Box>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                value={email}
                placeholder="Enter email"
                w="full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>
          </Box>
        </Grid>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Field.Root>
              <Field.Label>Phone</Field.Label>
              <Input
                value={phone}
                placeholder="Enter phone"
                w="full"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field.Root>
          </Box>
          <Box></Box>
        </Grid>

        <Fieldset.Root>
          <Fieldset.Legend as="h3" fontWeight="semibold" fontSize="lg" mt={4}>
            Addresses
          </Fieldset.Legend>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Box>
              <SelectRoot
                size="md"
                collection={countries}
                onValueChange={(country) => {
                  setSelectedCountry(Number(country.value[0]));
                  fetchStates(Number(country.value[0]));
                }}
              >
                <SelectLabel>Country</SelectLabel>
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
                collection={states}
                onValueChange={(state) => {
                  setSelectedState(Number(state.value[0]));
                  fetchCities(Number(state.value[0]));
                }}
                disabled={!selectedCountry}
              >
                <SelectLabel>State</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.items.map((state) => (
                    <SelectItem key={state.value} item={state}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Box>
          </Grid>

          <SelectRoot
            size="md"
            collection={cities}
            onValueChange={(city) => setSelectedCity(Number(city.value[0]))}
            disabled={!selectedState}
          >
            <SelectLabel>City</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.items.map((city) => (
                <SelectItem key={city.value} item={city}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Box>
              <Field.Root>
                <Field.Label>Street</Field.Label>
                <Input
                  value={street}
                  placeholder="Enter street"
                  w="full"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </Field.Root>
            </Box>

            <Box>
              <Field.Root>
                <Field.Label>Postal Code</Field.Label>
                <Input
                  placeholder="Enter postal code"
                  w="full"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </Field.Root>
            </Box>
          </Grid>
        </Fieldset.Root>

        {/* Submit Button */}
        <Button w="full" mt={4} onClick={handleSubmit}>
          Create Customer
        </Button>
      </VStack>
    </Container>
  );
};

export default CreateCustomerPage;
