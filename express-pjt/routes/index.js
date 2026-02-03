const apiRouter = require("express").Router();
const authRouter = require("./auth.route");
const feedRouter = require("./feed.route");

apiRouter.use("/feed", feedRouter);
apiRouter.use("/auth", authRouter);
module.exports = apiRouter; // export default 이랑 같음
