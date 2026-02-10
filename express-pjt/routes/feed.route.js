const feedRouter = require("express").Router();
const feedController = require("../controllers/feed.controller");

feedRouter.get("/", feedController.getFeed);
feedRouter.get("/:userId", feedController.getFeedByUser); // 특정 사람의 피드

module.exports = feedRouter;
