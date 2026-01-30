const authRouter = require("express").Router();

const users = new Map(); // 임시 사용자 저장소

const isValidId = (id) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,8}$/.test(id);
const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(pw);

/**
 * 회원가입
 */
authRouter.post("/signup", (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res
        .status(400)
        .json({ isError: true, message: "id/password required" });
    }

    if (!isValidId(id) || !isValidPassword(password)) {
      return res.status(400).json({ isError: true, message: "invalid input" });
    }

    if (users.has(id)) {
      return res
        .status(409)
        .json({ isError: true, message: "id already exists" });
    }

    users.set(id, { password });

    return res.status(201).json({
      isError: false,
      id,
      message: "회원가입에 성공했습니다!",
    });
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);

    return res.status(500).json({
      isError: true,
      message: "internal server error",
    });
  }
});

/**
 * 로그인
 */
authRouter.post("/login", (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res
        .status(400)
        .json({ isError: true, message: "id/password required" });
    }

    const user = users.get(id);
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ isError: true, message: "invalid credentials" });
    }

    return res.json({
      isError: false,
      message: "로그인에 성공했습니다!",
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);

    return res.status(500).json({
      isError: true,
      message: "internal server error",
    });
  }
});

module.exports = authRouter;
