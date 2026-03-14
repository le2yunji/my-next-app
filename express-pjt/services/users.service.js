const { AUTHORS } = require("../mocks/users.mock");

function getUserProfileById(userId) {
  return AUTHORS.find((author) => author.id === userId) || null;
}

module.exports = { getUserProfileById };
