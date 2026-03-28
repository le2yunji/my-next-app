function validateLogin(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        isError: true,
        message: "로그인 식별자와 비밀번호는 필수 입력값입니다.",
      });
    }

    if (typeof identifier !== "string" || typeof password !== "string") {
      return res.status(400).json({
        isError: true,
        message: "로그인 식별자와 비밀번호는 문자열이어야 합니다.",
      });
    }

    if (!identifier.trim() || !password.trim()) {
      return res.status(400).json({
        isError: true,
        message: "로그인 식별자와 비밀번호는 공백만 입력할 수 없습니다.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateLogin;
