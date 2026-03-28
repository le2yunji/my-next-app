const loginService = require("../services/login.service");

/**
 * 로그인
 */
async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;
    const result = await loginService.login({ identifier, password });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
