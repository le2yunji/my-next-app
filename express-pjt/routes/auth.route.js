const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller");
const validateSignup = require("../middlewares/validate-signup.middleware");
const validateLogin = require("../middlewares/validate-login.middleware");

authRouter.post("/signup", validateSignup, authController.signup);
authRouter.post("/login", validateLogin, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
