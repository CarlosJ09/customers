import { Spinner, Center } from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

function Fallback({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  const bg = useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(0, 0, 0, 0.5)");

  return (
    <Center position="fixed" top={0} left={0} w="100vw" h="100vh" zIndex="9999" bg={bg}>
      <Spinner size="xl" />
    </Center>
  );
}

export default Fallback;
