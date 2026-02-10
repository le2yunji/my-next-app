// services/feed.service.js
const { FEED_ITEMS } = require("../mocks/feed.mock");

exports.getFeedItems = () => {
  return FEED_ITEMS;
};
