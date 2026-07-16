import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthToken, setAuthToken } from "@/lib/auth-token";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

// The raw token never enters this persisted state — it lives only in the
// httpOnly-ish cookie set by setAuthToken (see lib/auth-token.ts), so
// `partialize` below keeps it out of localStorage.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, token) => {
        setAuthToken(token);
        set({ user, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        clearAuthToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
