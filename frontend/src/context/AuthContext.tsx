import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/token";
import { useNavigate } from "react-router";

interface AuthContextType {
  user: { token: string } | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
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

  const login = (accessToken: string, refreshToken: string) => {
    setToken(ACCESS_TOKEN_KEY, accessToken);
    setToken(REFRESH_TOKEN_KEY, refreshToken);
    setUser({ token: accessToken });
    navigate("/");
  };

  const logout = () => {
    removeToken(ACCESS_TOKEN_KEY);
    removeToken(REFRESH_TOKEN_KEY);
    setUser(null);
    navigate("/auth/sign-in");
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
