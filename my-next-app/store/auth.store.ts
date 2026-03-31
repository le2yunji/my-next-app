import { create } from "zustand";

type User = {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (value: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (value) => set({ isLoading: value }),
  clearUser: () => set({ user: null }),
}));
