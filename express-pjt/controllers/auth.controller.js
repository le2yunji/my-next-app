const authService = require("../services/auth.service");

const isValidId = (id) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,8}$/.test(id);

const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw);

/**
 * 회원가입
 */
function signup(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        isError: true,
        message: "아이디와 비밀번호는 필수 입력값입니다.",
      });
    }

    if (!isValidId(id) || !isValidPassword(password)) {
      return res.status(400).json({
        isError: true,
        message: "아이디 또는 비밀번호 형식이 올바르지 않습니다.",
      });
    }

    const result = authService.signup({ id, password });

    return res.status(201).json({
      isError: false,
      id: result.id,
      message: result.message, // "회원가입에 성공했습니다!"
    });
  } catch (error) {
    console.error("[회원가입 오류]", error);

    const status = error.status || 500;
    return res.status(status).json({
      isError: true,
      message: error.message || "서버 내부 오류가 발생했습니다.",
    });
  }
}

/**
 * 로그인
 */
function login(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        isError: true,
        message: "아이디와 비밀번호는 필수 입력값입니다.",
      });
    }

    if (!isValidId(id) || !isValidPassword(password)) {
      return res.status(400).json({
        isError: true,
        message: "아이디 또는 비밀번호 형식이 올바르지 않습니다.",
      });
    }

    const result = authService.login({ id, password });

    return res.json({
      isError: false,
      message: result.message, // "로그인에 성공했습니다!"
    });
  } catch (error) {
    console.error("[로그인 오류]", error);

    const status = error.status || 500;
    return res.status(status).json({
      isError: true,
      message: error.message || "서버 내부 오류가 발생했습니다.",
    });
  }
}

module.exports = { signup, login };
