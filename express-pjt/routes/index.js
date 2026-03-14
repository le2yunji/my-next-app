const apiRouter = require("express").Router();
const authRouter = require("./auth.route");
const feedRouter = require("./feed.route");
const usersRouter = require("./users.route");
const postsRouter = require("./posts.route");
const commentsRouter = require("./comments.route");

apiRouter.use("/feed", feedRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/posts", commentsRouter);

module.exports = apiRouter; // export default 이랑 같음
