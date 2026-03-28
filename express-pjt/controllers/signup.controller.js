const signupService = require("../services/signup.service");

/**
 * 회원가입
 */
async function signup(req, res, next) {
  try {
    const { id, email, phone, password, passwordConfirm, birth } = req.body;
    const user = await signupService.signup({
      id,
      email,
      phone,
      password,
      passwordConfirm,
      birth,
    });

    return res.status(201).json({
      user,
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    next(error); // 미들웨어에서 에러 처리
  }
}

module.exports = { signup };
