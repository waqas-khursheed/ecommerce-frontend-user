import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthToken, setAuthToken } from "@/lib/auth-token";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // `persist` reads localStorage asynchronously after the initial render, so
  // `isAuthenticated` starts as `false` on every page load/refresh until
  // rehydration finishes — any code that redirects-to-login the instant it
  // sees `isAuthenticated === false` (checkout page, account layout) was
  // firing during that window and kicking out already-logged-in users on
  // refresh. Callers must wait for `hasHydrated` before trusting a `false`.
  hasHydrated: boolean;
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

// The raw token never enters this persisted state — it lives only in the
// httpOnly-ish cookie set by setAuthToken (see lib/auth-token.ts), so
// `partialize` below keeps it out of localStorage.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setSession: (user, token) => {
        setAuthToken(token);
        set({ user, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        clearAuthToken();
        set({ user: null, isAuthenticated: false });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "user-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
