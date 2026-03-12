import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Id } from "../convex/_generated/dataModel";

type UserData = {
  _id: Id<"users">;
  name: string;
  nim: string;
  role: "mahasiswa" | "admin";
  email?: string;
  jurusan?: string;
  fakultas?: string;
  angkatan?: string;
  semester?: string;
  asrama?: string;
  kamar?: string;
  profileImage?: string;
};

type AuthContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await SecureStore.getItemAsync("user_data");
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (userData: UserData | null) => {
    setUserState(userData);
    if (userData) {
      await SecureStore.setItemAsync("user_data", JSON.stringify(userData));
    } else {
      await SecureStore.deleteItemAsync("user_data");
    }
  };

  const logout = async () => {
    setUserState(null);
    await SecureStore.deleteItemAsync("user_data");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
