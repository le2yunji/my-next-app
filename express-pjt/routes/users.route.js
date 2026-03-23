const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");

usersRouter.get("/:userId/profile", usersController.getUserProfile);
usersRouter.get("/:userId/feed", usersController.getUserFeed);

module.exports = usersRouter;
