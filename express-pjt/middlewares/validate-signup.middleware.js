const {
  isValidId,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidPhone,
} = require("../utils/regex");

function validateSignup(req, res, next) {
  try {
    const { name, userId, email, phone, password, passwordConfirm } = req.body;

    // 필수값 검사
    if (!userId || !name || !email || !phone || !password || !passwordConfirm) {
      return res.status(400).json({
        isError: true,
        message: "아이디, 이름, 이메일, 휴대폰 번호, 비밀번호, 비밀번호 확인은 필수 입력값입니다.",
      });
    }

    // 아이디 형식 검사
    if (!isValidId(userId)) {
      return res.status(400).json({
        isError: true,
        message: "아이디 형식이 올바르지 않습니다.",
      });
    }

    // 이름 형식 검사
    if (!isValidName(name)) {
      return res.status(400).json({
        isError: true,
        message: "이름 형식이 올바르지 않습니다.",
      });
    }
    // 비밀번호 형식 검사
    if (!isValidPassword(password)) {
      return res.status(400).json({
        isError: true,
        message: "비밀번호 형식이 올바르지 않습니다.",
      });
    }

    // 비밀번호 확인 일치 검사
    if (password !== passwordConfirm) {
      return res.status(400).json({
        isError: true,
        message: "비밀번호 확인이 일치하지 않습니다.",
      });
    }

    // 이메일 형식 검사
    if (!isValidEmail(email)) {
      return res.status(400).json({
        isError: true,
        message: "이메일 형식이 올바르지 않습니다.",
      });
    }

    // 휴대폰 번호 형식 검사
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        isError: true,
        message: "휴대폰 번호 형식이 올바르지 않습니다.",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateSignup;
