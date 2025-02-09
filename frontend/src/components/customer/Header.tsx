import { Heading, Button, HStack } from "@chakra-ui/react";

type HeaderProps = {
  onAddCustomer: () => void;
};

function Header({ onAddCustomer }: HeaderProps) {
  return (
    <HStack justifyContent="space-between" mb={8}>
      <Heading as="h1" size="xl">
        Customer Management
      </Heading>

      <HStack gap={8}>
        <Button onClick={onAddCustomer}>Add Customer</Button>
        <Button onClick={onAddCustomer}>Generate Report</Button>
      </HStack>
    </HStack>
  );
}

export default Header;
