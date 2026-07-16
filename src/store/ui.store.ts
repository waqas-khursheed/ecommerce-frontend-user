import { create } from "zustand";

interface UiState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
}

// Ephemeral UI state — intentionally not persisted.
export const useUiStore = create<UiState>()((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
}));
