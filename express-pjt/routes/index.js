const apiRouter = require("express").Router();
const authRouter = require("./auth.route");
const feedRouter = require("./feed.route");
const usersRouter = require("./users.route");
const postRouter = require("./post.route");
const uploadRouter = require("./upload.route");
const notificationsRouter = require("./notifications.route");

apiRouter.use("/feed", feedRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/post", postRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/notifications", notificationsRouter);

module.exports = apiRouter; // export default 이랑 같음
