const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");
const postsController = require("../controllers/post.controller");
const commentsController = require("../controllers/comments.controller");
const boardController = require("../controllers/board.controller");

const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");

usersRouter.get(
  "/:userId/profile",
  optionalAuthenticate,
  usersController.getUserProfile,
);

// usersRouter.post(
//   "/:userId/profile",
//   authenticate,
//   usersController.getUserProfile
// );

usersRouter.get(
  "/:userId/feed",
  optionalAuthenticate,
  usersController.getUserFeed,
);

usersRouter.get(
  "/:userId/post/:postId",
  optionalAuthenticate,
  postsController.getPostDetail,
);

usersRouter.get(
  "/:userId/boards",
  optionalAuthenticate,
  boardController.getUserBoards,
);

usersRouter.get(
  "/:userId/boards/:boardId",
  optionalAuthenticate,
  boardController.getUserBoardPage,
);

usersRouter.get(
  "/:userId/post/:postId/comments",
  optionalAuthenticate,
  commentsController.getPostComments,
);

usersRouter.post(
  "/:userId/post/:postId/comments",
  authenticate,
  commentsController.createPostComments,
);

usersRouter.post("/:userId/post", authenticate, postsController.createPost);

usersRouter.post("/:userId/follow", authenticate, usersController.followUser);

usersRouter.get("/me/notification-preferences", authenticate, usersController.getNotificationPreferences);
usersRouter.patch("/me/notification-preferences", authenticate, usersController.updateNotificationPreferences);

module.exports = usersRouter;
