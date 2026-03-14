const postsRouter = require("express").Router();
const postsController = require("../controllers/posts.controller");

postsRouter.get("/:postId", postsController.getPostDetail);

module.exports = postsRouter;
