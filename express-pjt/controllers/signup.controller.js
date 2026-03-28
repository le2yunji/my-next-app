const signupService = require("../services/signup.service");

/**
 * 회원가입
 */
async function signup(req, res, next) {
  try {
    const result = await signupService.signup(req.body);

    return res.status(201).json({
      isError: false,
      message: "회원가입이 완료되었습니다.",
      user: result,
    });
  } catch (error) {
    next(error); // 미들웨어에서 에러 처리
  }
}

module.exports = { signup };
