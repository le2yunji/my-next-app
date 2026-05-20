import { create } from "zustand";

export type SessionUser = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: SessionUser | null;
  // true: 아직 서버에서 로그인 상태를 확인 중 (AuthInitializer가 완료되면 false로 전환)
  isLoading: boolean;
  setUser: (user: SessionUser | null) => void;
  setIsLoading: (value: boolean) => void;
  clearUser: () => void;
};

// 로그인한 유저 정보를 전역으로 관리하는 스토어
// AuthInitializer가 마운트 시 /me API를 호출해 초기화하고, 로그아웃 시 clearUser로 초기화
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (value) => set({ isLoading: value }),
  clearUser: () => set({ user: null }),
}));
