const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require("./env");

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      id: user.id,
      type: "access",
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN || "1h",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      type: "refresh",
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN || "14d",
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
