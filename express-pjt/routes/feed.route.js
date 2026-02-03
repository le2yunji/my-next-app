const feedRouter = require("express").Router();
const feedController = require("../controllers/feed.controller");

feedRouter.get("/", feedController.getFeed);
feedRouter.get("/:id", feedController.getFeedById); // 특정 게시물

module.exports = feedRouter;
