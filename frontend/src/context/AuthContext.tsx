import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { ACCESS_TOKEN_KEY } from "@/constants/token";
import { useNavigate } from "react-router";

interface AuthContextType {
  user: { token: string } | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken(ACCESS_TOKEN_KEY);
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    setToken(ACCESS_TOKEN_KEY, token);
    setUser({ token });
  };

  const logout = () => {
    removeToken(ACCESS_TOKEN_KEY);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
