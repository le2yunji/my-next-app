const loginService = require("../services/auth/login.service");
const signupService = require("../services/auth/signup.service");
const meService = require("../services/auth/me.service");
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("../services/token.service");

const User = require("../models/user.model");

const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/cookie");

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

/**
 * 로그인
 */
async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await loginService.login(
      req.body,
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      isError: false,
      message: "로그인에 성공했습니다.",
      //   accessToken: accessToken, 쿠키에 넣고 있으면 보안상 body에 넣지 않아도 됨
      user,
    });
  } catch (error) {
    next(error);
  }
}

// 리프레쉬 토큰으로 액세스 토큰 재발급
async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        isError: true,
        message: "Refresh Token이 없습니다.",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        isError: true,
        message: "유효하지 않은 Refresh Token입니다.",
      });
    }

    const user = await User.findById(decoded.mongoId);

    if (!user || user.isDeleted) {
      return res.status(401).json({
        isError: true,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

    return res.status(200).json({
      isError: false,
      message: "Access Token이 재발급되었습니다.",
    });
  } catch (error) {
    next(error);
  }
}

// 로그아웃 시 토큰 삭제
function logout(_req, res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    isError: false,
    message: "로그아웃되었습니다.",
  });
}

// 쿠키에서 access token 읽음
// 토큰 검증
// 토큰 안의 userId로 DB 조회
// 현재 로그인한 사용자 정보 반환
async function me(req, res, next) {
  try {
    const user = await meService.getMe(req.user.mongoId);

    return res.status(200).json({
      isError: false,
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  me,
};
