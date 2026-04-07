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
      mongoId: decoded.mongoId,
      userId: decoded.userId,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        isError: true,
        code: "TOKEN_EXPIRED", // 클라이언트가 이 코드 보고 refresh 요청
        message: "토큰이 만료되었습니다.",
      });
    }

    return res.status(401).json({
      isError: true,
      code: "TOKEN_INVALID",
      message: "유효하지 않은 토큰입니다.",
    });
  }
}

// 조회용 미들웨어
function optionalAuthenticate(req, _res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    // 토큰 없으면 비로그인 사용자로 통과
    if (!accessToken) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded.type !== "access") {
      req.user = null;
      return next();
    }

    req.user = {
      mongoId: decoded.mongoId,
      userId: decoded.userId ?? decoded.id,
    };

    return next();
  } catch (error) {
    // 조회 API에서는 토큰 오류가 있어도 막지 않고 비로그인처럼 처리
    req.user = null;
    return next();
  }
}

module.exports = { authenticate, optionalAuthenticate };
