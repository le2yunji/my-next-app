const isValidId = (id) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,8}$/.test(id);

const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw);

const normalizePhone = (phone) => phone.replace(/[^0-9]/g, "");

const normalization = (input) => input.trim().toLowerCase();

module.exports = {
  isValidId,
  isValidPassword,
  normalizePhone,
  normalization,
};
