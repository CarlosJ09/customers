import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import Fallback from "@/components/ui/fallback";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log(user);
      navigate("/auth/sign-in", { replace: true });
    }
  }, [loading, user]);

  return loading ? <Fallback isLoading={loading} /> : <>{children}</>;
};

export default ProtectedRoute;
