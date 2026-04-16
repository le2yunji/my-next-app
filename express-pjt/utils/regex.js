const isValidId = (userId) =>
  /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d._]{2,8}$/.test(userId); // 앞뒤 공백 없이, 영문자 1개 이상 + 숫자 1개 이상 포함, 영문/숫자/./_만 허용하는 2~8자 아이디

const isValidPassword = (pw) =>
  /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw); // 앞뒤 공백 없이, 영문자 1개 이상 + 숫자 1개 이상 포함한 8~16자 비밀번호

const isValidEmail = (email) =>
  /^(?!\s)(?!.*\s$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // 앞뒤 공백 없이, 공백 없이 @와 .을 포함한 기본 이메일 형식인지

const isValidPhone = (phone) => {
  if (/^\s|\s$/.test(phone)) return false; // 전화번호 앞뒤 공백 금지
  const normalizedPhone = phone.replace(/[^0-9]/g, ""); // 전화번호에서 숫자를 제외한 모든 문자 제거
  return /^01[016789]\d{7,8}$/.test(normalizedPhone); // 숫자만 남긴 값이 국내 휴대폰 형식(010, 011, 016~019)인지
};

const isValidName = (name) =>
  /^(?!.*\s{2,})(?=.{2,20}$)[가-힣a-zA-Z]+(?:\s[가-힣a-zA-Z]+)*$/.test(name); // 앞뒤 공백 없이, 연속 공백 없이, 한글/영문과 단일 공백만 허용하는 2~20자 이름 형식

const normalizePhone = (phone) => phone.replace(/[^0-9]/g, ""); // 전화번호에서 하이픈, 공백 등 숫자가 아닌 문자 제거

const normalizeText = (input) => input.trim().toLowerCase(); // 앞뒤 공백 제거 후 소문자로 변환해 비교하기 쉽게 정규화

const isValidCustomCategory = (item) =>
  /^(?!\s)(?!.*\s$)(?!.*\s{2,})[가-힣a-zA-Z0-9\s]{1,20}$/.test(item); // 앞뒤·연속 공백 없이, 한글/영문/숫자/단일 공백만 허용하는 1~20자 커스텀 카테고리

module.exports = {
  isValidId,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidName,
  normalizePhone,
  normalizeText,
  isValidCustomCategory,
};
