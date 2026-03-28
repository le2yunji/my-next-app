const authRouter = require("express").Router();
const signupController = require("../controllers/signup.controller");
const loginController = require("../controllers/login.controller");
const validateSignup = require("../middlewares/validate-signup.middleware");
const validateLogin = require("../middlewares/validate-login.middleware");

authRouter.post("/signup", validateSignup, signupController.signup);
authRouter.post("/login", validateLogin, loginController.login);

module.exports = authRouter;
