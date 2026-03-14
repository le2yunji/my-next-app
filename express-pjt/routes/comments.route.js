const commentsRouter = require("express").Router();
const commentsController = require("../controllers/comments.controller");

commentsRouter.get("/:postId/comments", commentsController.getComment);

module.exports = commentsRouter;
