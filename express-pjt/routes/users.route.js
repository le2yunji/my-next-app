const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");
const postsController = require("../controllers/posts.controller");
const commentsController = require("../controllers/comments.controller");
const authenticate = require("../middlewares/auth.middleware");

usersRouter.get(
  "/:userId/profile",
  authenticate,
  usersController.getUserProfile
);
usersRouter.get("/:userId/feed", authenticate, usersController.getUserFeed);

usersRouter.get(
  "/:userId/posts/:postId",
  authenticate,
  postsController.getPostDetail
);
usersRouter.get(
  "/:userId/posts/:postId/comments",
  authenticate,
  commentsController.getPostComments
);

module.exports = usersRouter;
