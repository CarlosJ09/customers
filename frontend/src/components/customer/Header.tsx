import { Heading, Button, HStack } from "@chakra-ui/react";

type HeaderProps = {
  onAddCustomer: () => void;
  onGenerateReport: () => void;
};

function Header({ onAddCustomer, onGenerateReport }: HeaderProps) {
  return (
    <HStack justifyContent="space-between" mb={8}>
      <Heading as="h1" size="xl">
        Customers Management
      </Heading>

      <HStack gap={8}>
        <Button onClick={onAddCustomer}>Add Customer</Button>

        <Button onClick={onGenerateReport}>Generate Report</Button>
      </HStack>
    </HStack>
  );
}

export default Header;
