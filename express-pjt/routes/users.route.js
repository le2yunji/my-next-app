const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");

// usersRouter.get("/", usersController.getFeed);
usersRouter.get("/:userId/posts", usersController.getUserFeed);

module.exports = usersRouter;
