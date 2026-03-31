const {
  isValidId,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidPhone,
} = require("../utils/regex");

function validateSignup(req, res, next) {
  try {
    const { name, id, email, phone, password, passwordConfirm } = req.body;

    // 필수값 검사
    if (!id || !password || !passwordConfirm) {
      return res.status(400).json({
        isError: true,
        message: "이름, 아이디, 비밀번호, 비밀번호 확인은 필수 입력값입니다.",
      });
    }

    // 아이디 형식 검사
    if (!isValidId(id)) {
      return res.status(400).json({
        isError: true,
        message: "아이디 형식이 올바르지 않습니다.",
      });
    }

    // 이름 형식 검사
    if (name && !isValidName(name)) {
      return res.status(400).json({
        isError: true,
        message: "이름 형식이 올바르지 않습니다.",
      });
    }
    console.log("name raw:", JSON.stringify(name));
    console.log("name valid:", isValidName(name));

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
