const postsRouter = require("express").Router();
const commentsController = require("../controllers/comments.controller");
const postLikeController = require("../controllers/post-like.controller");
const {
  optionalAuthenticate,
  authenticate,
} = require("../middlewares/auth.middleware");

postsRouter.get(
  "/:postId/comments",
  optionalAuthenticate,
  commentsController.getPostComments,
);

postsRouter.post(
  "/:postId/comments",
  authenticate,
  commentsController.createPostComments,
);

postsRouter.delete(
  "/:postId/comments/:commentId",
  authenticate,
  commentsController.deletePostComment,
);

postsRouter.patch(
  "/:postId/comments/:commentId",
  authenticate,
  commentsController.updatePostComment,
);

postsRouter.post(
  "/:postId/comments/:commentId/like",
  authenticate,
  commentsController.toggleCommentLikeHandler,
);

postsRouter.post("/:postId/like", authenticate, postLikeController.toggleLike);

module.exports = postsRouter;
