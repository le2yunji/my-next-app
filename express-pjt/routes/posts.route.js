const postsRouter = require("express").Router();
const postsController = require("../controllers/posts.controller");
const commentsController = require("../controllers/comments.controller");

postsRouter.get("/:postId", postsController.getPostDetail);
postsRouter.get("/:postId/comments", commentsController.getPostComments);

module.exports = postsRouter;
