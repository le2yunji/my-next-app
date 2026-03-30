const accessTokenCookieOptions = {
  httpOnly: true,
  secure: false, // 배포 HTTPS에서는 true
  sameSite: "lax", // strict, lax, none
  maxAge: 1000 * 60 * 60, // 1시간
  path: "/",
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: false, // 배포 HTTPS에서는 true
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
  path: "/",
};

module.exports = { accessTokenCookieOptions, refreshTokenCookieOptions };
