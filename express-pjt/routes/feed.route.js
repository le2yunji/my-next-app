const feedRouter = require("express").Router();
const feedController = require("../controllers/feed.controller");
const { optionalAuthenticate } = require("../middlewares/auth.middleware");

feedRouter.get("/", optionalAuthenticate, feedController.getFeed);

module.exports = feedRouter;
1;
