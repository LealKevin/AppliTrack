import type { UserInput } from "../hooks/useConnection";
import {
  connectUser,
  getUser,
  logoutUser,
  type UserType,
} from "@/shared/utils/apiCalls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";

interface AuthContexType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: UserInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContexType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
    isSuccess,
  } = useQuery<UserType>({
    queryKey: ["currentUser"],
    queryFn: getUser,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: true,
  });

  const isAuthenticated = Boolean(isSuccess && user);

  const login = useCallback(async (input: UserInput) => {
    try {
      await connectUser(input);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Invalidate all application-related queries to ensure fresh data after login
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      await queryClient.invalidateQueries({ queryKey: ["appsCount"] });
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
    } catch (error) {
      console.error("Login failed: ", error);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isLoading: isLoadingUser,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isLoadingUser, isAuthenticated, login, logout],
  );

  if (isLoadingUser && !isSuccess && !isError) {
    return <div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be within a AuthProvider");
  }

  return context;
}
