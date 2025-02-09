import { useEffect, useState } from "react";
import { HStack, Field, Input, ListCollection, createListCollection } from "@chakra-ui/react";
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { addressService } from "@/services/AddressService";

type FiltersProps = {
  filterText: string;
  onFilterTextChange: (text: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
};

const initListCollection = createListCollection({
  items: [],
});

function Filters({ filterText, onFilterTextChange, status, onStatusChange }: FiltersProps) {
  const [countries, setCountries] = useState<ListCollection>(initListCollection);
  const [states, setStates] = useState<ListCollection>(initListCollection);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries.items.length > 0) {
      const countryId = countries.items[0].value;
      fetchStates(countryId);
    }
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await addressService.getCountries();
      if (response.status === 200) {
        const data = response.data.map((country) => ({
          label: country.name,
          value: country.id,
        }));
        const countriesCollection = createListCollection({ items: data });
        setCountries(countriesCollection);
      }
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  const fetchStates = async (countryId: number) => {
    try {
      const response = await addressService.getStatesByCountry(countryId);
      if (response.status === 200) {
        const data = response.data.map((state) => ({
          label: state.name,
          value: state.id,
        }));
        const statesCollection = createListCollection({ items: data });
        setStates(statesCollection);
      }
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  return (
    <HStack mb={8}>
      <Field.Root>
        <Field.Label>Name / Email</Field.Label>
        <Input
          placeholder="Filter by name or email"
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
      </Field.Root>

      <SelectRoot size="md" collection={countries}>
        <SelectLabel>Country</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Filter by country" />
        </SelectTrigger>
        <SelectContent>
          {countries.items.map((country) => (
            <SelectItem key={country.value} item={country}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <SelectRoot size="md" collection={initListCollection}>
        <SelectLabel>State</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Filter by state" />
        </SelectTrigger>
        <SelectContent>
          {states.items.map((state) => (
            <SelectItem key={state.value} item={state}>
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </HStack>
  );
}

export default Filters;
