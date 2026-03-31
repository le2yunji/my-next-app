// src/features/auth/constants/messages.ts
export const AUTH_ERROR_MESSAGES = {
  id: "아이디는 영문자와 숫자를 각각 1개 이상 포함한 2~8자여야 하며, .과 _만 사용할 수 있습니다.",
  password:
    "비밀번호는 영문자와 숫자를 각각 1개 이상 포함한 8~16자여야 합니다.",
  passwordConfirm: "비밀번호가 일치하지 않습니다.",
  email: "올바른 이메일 형식을 입력해 주세요.",
  phone: "올바른 휴대폰 번호를 입력해 주세요.",
  name: "이름은 한글 또는 영문 2~20자로 입력해 주세요. 공백은 연속해서 사용할 수 없습니다.",
  signupFailed: "회원가입 실패",
  signupUnexpected: "회원가입 중 오류가 발생했습니다.",

  identifier: "전화번호, 아이디 또는 이메일을 입력해 주세요.",
} as const;
