const postsRouter = require("express").Router();
const commentsController = require("../controllers/comments.controller");
const { optionalAuthenticate } = require("../middlewares/auth.middleware");

postsRouter.get(
  "/:postId/comments",
  optionalAuthenticate,
  commentsController.getPostComments,
);

module.exports = postsRouter;
