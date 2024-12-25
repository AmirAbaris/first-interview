"use client";

import { checkUserAuth } from "@/components/layout/action";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAuth() {
  const [storedUser, setStoredUser] = useState<null | { email: string }>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setStoredUser(user ? JSON.parse(user) : null);
  }, []);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (!storedUser) return null;
      return checkUserAuth(storedUser.email);
    },
    enabled: !!storedUser,
  });

  return { user, isLoading, isError };
}
