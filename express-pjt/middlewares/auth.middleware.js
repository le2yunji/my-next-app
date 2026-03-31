const { verifyAccessToken } = require("../services/token.service");

function authenticate(req, res, next) {
  try {
    console.log("cookies:", req.cookies);

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        isError: true,
        message: "Access Token이 없습니다.",
      });
    }

    const decoded = verifyAccessToken(accessToken);
    console.log("decoded:", decoded);

    if (decoded.type !== "access") {
      return res.status(401).json({
        isError: true,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    req.user = {
      mongoId: decoded.mongoId,
      id: decoded.id,
    };

    return next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      isError: true,
      message: "토큰이 만료되었거나 유효하지 않습니다.",
    });
  }
}

module.exports = authenticate;
