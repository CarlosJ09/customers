import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/auth/sign-in", { replace: true });
    }
  }, [loading, user]);

  return <>{children}</>;
};

export default ProtectedRoute;
