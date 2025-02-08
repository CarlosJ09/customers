import { ReactNode } from "react";
import ProtectedRoute from "@/router/ProtectedRoute";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

export const BaseLayout = ({ children }: LayoutProps) => {
  return (
    <ProtectedRoute>
      <Box minH="100vh">{children}</Box>;
    </ProtectedRoute>
  );
};

export default BaseLayout;
