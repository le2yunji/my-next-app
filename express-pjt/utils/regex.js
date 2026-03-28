const isValidId = (id) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,8}$/.test(id);

const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) => {
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  return /^01[016789]\d{7,8}$/.test(normalizedPhone);
};

const normalizePhone = (phone) => phone.replace(/[^0-9]/g, "");

const normalization = (input) => input.trim().toLowerCase();

module.exports = {
  isValidId,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  normalizePhone,
  normalization,
};
