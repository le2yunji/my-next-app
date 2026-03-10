const apiRouter = require("express").Router();
const authRouter = require("./auth.route");
const feedRouter = require("./feed.route");
const usersRouter = require("./users.route");

apiRouter.use("/feed", feedRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter; // export default 이랑 같음
