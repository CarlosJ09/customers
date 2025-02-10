import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "@/utils/auth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "@/constants/token";
import { useNavigate } from "react-router";

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getLocalStorageItem(ACCESS_TOKEN_KEY);
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setLocalStorageItem(ACCESS_TOKEN_KEY, accessToken);
    setLocalStorageItem(REFRESH_TOKEN_KEY, refreshToken);
    setLocalStorageItem(USER_KEY, JSON.stringify(user));
    setUser(user);
    navigate("/");
  };

  const logout = () => {
    removeLocalStorageItem(ACCESS_TOKEN_KEY);
    removeLocalStorageItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
