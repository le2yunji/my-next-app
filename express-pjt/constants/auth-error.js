// constants/auth-error.js

const AUTH_ERROR = {
  ID_REQUIRED: {
    code: "ID_REQUIRED",
    message: "아이디는 반드시 입력해야 합니다.",
    status: 400,
  },
  NAME_REQUIRED: {
    code: "NAME_REQUIRED",
    message: "이름은 반드시 입력해야 합니다.",
    status: 400,
  },
  EMAIL_REQUIRED: {
    code: "EMAIL_REQUIRED",
    message: "이메일은 반드시 입력해야 합니다.",
    status: 400,
  },
  PHONE_REQUIRED: {
    code: "PHONE_REQUIRED",
    message: "휴대폰 번호는 반드시 입력해야 합니다.",
    status: 400,
  },
  PASSWORD_REQUIRED: {
    code: "PASSWORD_REQUIRED",
    message: "비밀번호는 반드시 입력해야 합니다.",
    status: 400,
  },
  PASSWORD_CONFIRM_REQUIRED: {
    code: "PASSWORD_CONFIRM_REQUIRED",
    message: "비밀번호 확인은 반드시 입력해야 합니다.",
    status: 400,
  },

  INVALID_ID: {
    code: "INVALID_ID",
    message:
      "아이디는 앞뒤 공백 없이 영문자와 숫자를 각각 1개 이상 포함해야 하며, 영문/숫자/./_만 사용한 2~8자여야 합니다.",
    status: 400,
  },
  INVALID_NAME: {
    code: "INVALID_NAME",
    message: "이름은 앞뒤 공백과 연속 공백 없이 한글/영문 2~20자여야 합니다.",
    status: 400,
  },
  INVALID_EMAIL: {
    code: "INVALID_EMAIL",
    message: "이메일 형식이 올바르지 않습니다.",
    status: 400,
  },
  INVALID_PHONE: {
    code: "INVALID_PHONE",
    message: "휴대폰 번호 형식이 올바르지 않습니다.",
    status: 400,
  },
  INVALID_PASSWORD: {
    code: "INVALID_PASSWORD",
    message:
      "비밀번호는 앞뒤 공백 없이 영문자와 숫자를 각각 1개 이상 포함한 8~16자여야 합니다.",
    status: 400,
  },
  PASSWORD_CONFIRM_MISMATCH: {
    code: "PASSWORD_CONFIRM_MISMATCH",
    message: "비밀번호 확인이 일치하지 않습니다.",
    status: 400,
  },

  DUPLICATE_ID: {
    code: "DUPLICATE_ID",
    message: "이미 사용 중인 아이디입니다.",
    status: 409,
  },
  DUPLICATE_EMAIL: {
    code: "DUPLICATE_EMAIL",
    message: "이미 사용 중인 이메일입니다.",
    status: 409,
  },
  DUPLICATE_PHONE: {
    code: "DUPLICATE_PHONE",
    message: "이미 사용 중인 휴대폰 번호입니다.",
    status: 409,
  },

  INVALID_INTEREST_CATEGORY: {
    code: "INVALID_INTEREST_CATEGORY",
    message: "유효하지 않은 관심사 카테고리가 포함되어 있습니다.",
    status: 400,
  },
  INVALID_CUSTOM_CATEGORY: {
    code: "INVALID_CUSTOM_CATEGORY",
    message:
      "커스텀 관심사는 앞뒤·연속 공백 없이 한글/영문/숫자만 허용하는 1~20자여야 합니다.",
    status: 400,
  },
  INTEREST_CATEGORY_LIMIT: {
    code: "INTEREST_CATEGORY_LIMIT",
    message:
      "관심사 카테고리와 커스텀 관심사는 합산 최대 10개까지 등록할 수 있습니다.",
    status: 400,
  },
};

module.exports = { AUTH_ERROR };
