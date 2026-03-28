const loginService = require("../services/login.service");

/**
 * 로그인
 */
async function login(req, res, next) {
  try {
    const result = await loginService.login(req.body);

    return res.status(200).json({
      isError: false,
      message: "로그인에 성공했습니다.",
      user: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
