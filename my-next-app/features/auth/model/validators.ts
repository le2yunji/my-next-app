/**
 * 아이디 유효성 검사
 * - 앞뒤 공백 불가
 * - 영문자 1개 이상 + 숫자 1개 이상 포함
 * - 영문/숫자/./_ 만 허용
 * - 2자 이상 8자 이하
 */
export const isValidId = (id: string): boolean => {
  const idRegex = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d._]{2,8}$/;
  return idRegex.test(id);
};

/**
 * 비밀번호 유효성 검사
 * - 앞뒤 공백 불가
 * - 영문자 1개 이상 + 숫자 1개 이상 포함
 * - 8자 이상 16자 이하
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])(?=.*\d).{8,16}$/;
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

/**
 * 이메일 유효성 검사
 * - 앞뒤 공백 불가
 * - 공백 없이 @와 .을 포함한 기본 이메일 형식 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^(?!\s)(?!.*\s$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 유효성 검사
 * - 앞뒤 공백 불가
 * - 숫자만 추출한 뒤 국내 휴대폰 형식(010, 011, 016~019)인지 검사
 */
export const isValidPhone = (phone: string): boolean => {
  if (/^\s|\s$/.test(phone)) return false;

  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  const phoneRegex = /^01[016789]\d{7,8}$/;

  return phoneRegex.test(normalizedPhone);
};

/**
 * 이름 유효성 검사
 * - 앞뒤 공백 불가
 * - 연속 공백 불가
 * - 한글/영문만 허용
 * - 이름 사이 공백은 1칸만 허용
 * - 2자 이상 20자 이하
 */
export const isValidName = (name: string): boolean => {
  const nameRegex =
    /^(?!.*\s{2,})(?=.{2,20}$)[가-힣a-zA-Z]+(?:\s[가-힣a-zA-Z]+)*$/;
  return nameRegex.test(name);
};

/**
 * 전화번호 정규화
 * - 숫자를 제외한 문자 제거
 */
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[^0-9]/g, "");
};

/**
 * 텍스트 정규화
 * - 앞뒤 공백 제거 후 소문자로 변환
 */
export const normalizeText = (input: string): string => {
  return input.trim().toLowerCase();
};
