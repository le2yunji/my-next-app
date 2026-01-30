const apiRouter = require("express").Router();
const usersRouter = require("./users.route");
const authRouter = require("./auth.route");

apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);
module.exports = apiRouter; // export default 이랑 같음
