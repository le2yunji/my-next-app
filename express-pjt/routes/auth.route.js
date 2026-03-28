const authRouter = require("express").Router();
const signupController = require("../controllers/signup.controller");
const loginController = require("../controllers/login.controller");

authRouter.post("/signup", signupController.signup);
authRouter.post("/login", loginController.login);

module.exports = authRouter;
