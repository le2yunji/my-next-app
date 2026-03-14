const isValidId = (id) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,8}$/.test(id);

const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw);

module.exports = { isValidId, isValidPassword };
