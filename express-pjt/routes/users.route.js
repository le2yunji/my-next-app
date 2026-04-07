const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");
const postsController = require("../controllers/posts.controller");
const commentsController = require("../controllers/comments.controller");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");

usersRouter.get(
  "/:userId/profile",
  optionalAuthenticate,
  usersController.getUserProfile
);

// usersRouter.post(
//   "/:userId/profile",
//   authenticate,
//   usersController.getUserProfile
// );

usersRouter.get(
  "/:userId/feed",
  optionalAuthenticate,
  usersController.getUserFeed
);

usersRouter.get(
  "/:userId/posts/:postId",
  optionalAuthenticate,
  postsController.getPostDetail
);
usersRouter.get(
  "/:userId/posts/:postId/comments",
  optionalAuthenticate,
  commentsController.getPostComments
);

module.exports = usersRouter;
