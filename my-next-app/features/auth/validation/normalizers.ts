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
