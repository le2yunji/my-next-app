const usersRouter = require("express").Router();
const { users } = require("../mocks/user.mock");

usersRouter.get("/", (req, res) => {
  return res.json({
    message: "This is userRouter entrypoint!",
    users,
  });
});

usersRouter.get("/me", (req, res) => {
  return res.json({
    message: "This is userRouter entrypoint!!!!!",
  });
});

module.exports = usersRouter; // export default 이랑 같음
