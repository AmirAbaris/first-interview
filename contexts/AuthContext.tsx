"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { email: string } | null;
  setUser: (user: { email: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("user")) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const safeSetUser = (newUser: { email: string } | null) => {
    setUser(newUser);
    if (typeof window !== "undefined" && newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: safeSetUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
