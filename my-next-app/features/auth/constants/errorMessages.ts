// src/features/auth/model/messages.ts
export const AUTH_ERROR_MESSAGES = {
  id: "아이디는 영문+숫자 조합 2~8자여야 합니다.",
  password: "비밀번호는 영문+숫자 포함 8~16자여야 합니다.",
  passwordConfirm: "비밀번호가 일치하지 않습니다.",
  signupFailed: "회원가입 실패",
  signupUnexpected: "회원가입 중 오류가 발생했습니다.",
} as const;
