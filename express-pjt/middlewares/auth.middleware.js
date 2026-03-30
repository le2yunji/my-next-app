const { verifyAccessToken } = require("../services/token.service");

function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        isError: true,
        message: "Access Token이 없습니다.",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded.type !== "access") {
      return res.status(401).json({
        isError: true,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    req.user = {
      userId: decoded.userId,
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      isError: true,
      message: "토큰이 만료되었거나 유효하지 않습니다.",
    });
  }
}

module.exports = authenticate;
