const {
  isValidId,
  isValidPassword,
  isValidEmail,
  isValidPhone,
} = require("../utils/regex");

function validateSignup(req, res, next) {
  try {
    const { id, email, phone, password, passwordConfirm } = req.body;

    // 1. 필수값 검사
    if (!id || !password || !passwordConfirm) {
      return res.status(400).json({
        isError: true,
        message: "아이디, 비밀번호, 비밀번호 확인은 필수 입력값입니다.",
      });
    }

    // 2. 이메일 / 휴대폰 중 하나는 반드시 필요
    if (!email && !phone) {
      return res.status(400).json({
        isError: true,
        message: "이메일 또는 휴대폰 번호 중 하나는 반드시 입력해야 합니다.",
      });
    }

    // 3. 아이디 형식 검사
    if (!isValidId(id)) {
      return res.status(400).json({
        isError: true,
        message: "아이디 형식이 올바르지 않습니다.",
      });
    }

    // 4. 비밀번호 형식 검사
    if (!isValidPassword(password)) {
      return res.status(400).json({
        isError: true,
        message: "비밀번호 형식이 올바르지 않습니다.",
      });
    }

    // 5. 비밀번호 확인 일치 검사
    if (password !== passwordConfirm) {
      return res.status(400).json({
        isError: true,
        message: "비밀번호 확인이 일치하지 않습니다.",
      });
    }

    // 6. 이메일 형식 검사
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        isError: true,
        message: "이메일 형식이 올바르지 않습니다.",
      });
    }

    // 7. 휴대폰 번호 형식 검사
    if (phone && !isValidPhone(phone)) {
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
