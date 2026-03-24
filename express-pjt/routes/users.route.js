const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");
const postsController = require("../controllers/posts.controller");
const commentsController = require("../controllers/comments.controller");

usersRouter.get("/:userId/profile", usersController.getUserProfile);
usersRouter.get("/:userId/feed", usersController.getUserFeed);

usersRouter.get("/:userId/posts/:postId", postsController.getPostDetail);
usersRouter.get(
  "/:userId/posts/:postId/comments",
  commentsController.getPostComments
);

module.exports = usersRouter;
