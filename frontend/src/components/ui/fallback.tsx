import { Spinner, Center } from "@chakra-ui/react";

function Fallback() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}

export default Fallback;
