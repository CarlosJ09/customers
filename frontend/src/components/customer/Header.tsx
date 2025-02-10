import { Heading, Button, HStack, Stack } from "@chakra-ui/react";

type HeaderProps = {
  onAddCustomer: () => void;
  onGenerateReport: () => void;
};

function Header({ onAddCustomer, onGenerateReport }: HeaderProps) {
  return (
    <Stack
      direction={["column", "row"]}
      justifyContent="space-between"
      alignItems={["center", "center"]}
      mb={8}
      gap={[4, 8]}
    >
      <Heading as="h1" size={["lg", "xl"]} textAlign={["center", "left"]}>
        Customers Management
      </Heading>
      <Stack direction={["column", "row"]} gap={[4, 8]} width={["100%", "auto"]}>
        <Button onClick={onAddCustomer} width={["100%", "auto"]}>
          Add Customer
        </Button>
        <Button onClick={onGenerateReport} width={["100%", "auto"]}>
          Generate Report
        </Button>
      </Stack>
    </Stack>
  );
}

export default Header;
