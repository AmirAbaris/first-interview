import { useQuery } from "@tanstack/react-query";
import { checkUserAuth } from "@/components/layout/action";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, setUser } = useAuthContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser) {
        const fetchedUser = await checkUserAuth(parsedUser.email);
        setUser(fetchedUser);
        return fetchedUser;
      }

      setUser(null);
      return null;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { user: user || data, isLoading, isError };
}
