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
  selectedCountry: number | null;
  onCountryChange: (countryId: number | null) => void;
};

const initListCollection = createListCollection({
  items: [],
});

function Filters({
  filterText,
  onFilterTextChange,
  selectedCountry,
  onCountryChange,
}: FiltersProps) {
  const [countries, setCountries] = useState<ListCollection>(initListCollection);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await addressService.getCountries();
      if (response.status === 200) {
        const data = response.data.results.map((country) => ({
          label: country.name,
          value: country.id.toString(),
        }));
        const countriesCollection = createListCollection({ items: data });
        setCountries(countriesCollection);
      }
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  return (
    <HStack mb={8}>
      <Field.Root>
        <Field.Label>Name / Email</Field.Label>
        <Input
          placeholder="Filter by name or email"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
      </Field.Root>

      <SelectRoot
        size="md"
        collection={countries}
        value={selectedCountry ? [selectedCountry.toString()] : []}
        onValueChange={(value) => onCountryChange(value ? Number(value.value[0]) : null)}
      >
        <SelectLabel>Country</SelectLabel>
        <SelectTrigger clearable>
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
    </HStack>
  );
}

export default Filters;
