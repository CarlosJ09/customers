import { ReactNode } from "react";
import ProtectedRoute from "@/router/ProtectedRoute";
import DrawerWrapper from "@/components/ui/drawer";

interface LayoutProps {
  children: ReactNode;
}

export const BaseLayout = ({ children }: LayoutProps) => {
  return (
    <ProtectedRoute>
      <DrawerWrapper>{children}</DrawerWrapper>
    </ProtectedRoute>
  );
};

export default BaseLayout;
