const feedRouter = require("express").Router();
const feedController = require("../controllers/feed.controller");

feedRouter.get("/", feedController.getFeed);
feedRouter.get("/user/:userId", feedController.getFeedByUser);

module.exports = feedRouter;
