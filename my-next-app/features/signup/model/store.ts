import { create } from "zustand";
import type { SignupForm } from "@/features/signup/model/type";

type SignupState = {
  form: SignupForm;
  setField: <K extends keyof SignupForm>(key: K, value: SignupForm[K]) => void;
  reset: () => void;
};

const STORAGE_KEY = "signup-form";

const initialForm: SignupForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirm: "",
  interestCategories: [],
  customInterestCategories: [],
};

/**
 * localStorage에서 저장된 폼 데이터를 불러옴
 * - SSR 환경(window 없음)에서는 초기값을 반환
 * - 비밀번호는 저장하지 않으므로 복원 시 빈 값으로 채움
 * - 파싱 오류 발생 시 초기값을 반환
 */
const loadFromStorage = (): SignupForm => {
  if (typeof window === "undefined") return initialForm;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialForm;
    const parsed = JSON.parse(stored);
    return { ...initialForm, ...parsed, password: "", passwordConfirm: "" };
  } catch {
    return initialForm;
  }
};

/**
 * 폼 데이터를 localStorage에 저장
 * - 비밀번호 필드는 보안상 저장에서 제외
 */
const saveToStorage = (form: SignupForm) => {
  if (typeof window === "undefined") return;
  const { password, passwordConfirm, ...toStore } = form;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

/**
 * 회원가입 폼 전역 상태 스토어
 *
 * - 멀티 스텝 회원가입 폼의 데이터를 단계 간 유지
 * - 새로고침 시에도 입력값을 유지하기 위해 localStorage와 동기화
 * - 회원가입 완료 또는 이탈 시 reset()을 호출해 localStorage까지 초기화
 */
export const useSignupStore = create<SignupState>((set) => ({
  // 스토어 초기화 시 localStorage에서 이전 입력값 복원
  form: loadFromStorage(),

  // 특정 필드 값을 업데이트하고 localStorage에 동기화
  setField: (key, value) =>
    set((state) => {
      const updated = { ...state.form, [key]: value };
      saveToStorage(updated);
      return { form: updated };
    }),

  // 전체 폼을 초기화하고 localStorage 데이터도 삭제
  reset: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ form: initialForm });
  },
}));
