/**
 * 아이디 유효성 검사 (영문+숫자 조합)
 */
export const isValidId = (id: string): boolean => {
  const idRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{2,8}$/;
  return idRegex.test(id);
};

/**
 * 비밀번호 유효성 검사 (8자 이상 16자 이하, 영문+숫자 포함)
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
  return passwordRegex.test(password);
};

/**
 * 비밀번호 일치 확인
 */
export const isPasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && password.length > 0;
};
