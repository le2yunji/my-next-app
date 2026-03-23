const { USERS, USER_MAP } = require("./users.mock");
const { FOLLOWS } = require("./follows.mock");
const {
  POSTS,
  POST_MEDIA,
  POST_LIKES,
  COMMENTS,
  POST_MEDIA_MAP,
  POST_LIKE_MAP,
  COMMENT_MAP,
} = require("./posts.mock");
const {
  DEFAULT_PROFILE_IMAGE_URL,
  resolveProfileImageUrl,
} = require("./constants/image-paths");

const { withResolvedProfileImage } = require("./helpers/mock.helpers");

module.exports = {
  USERS,
  USER_MAP,
  FOLLOWS,
  POSTS,
  POST_MEDIA,
  POST_LIKES,
  COMMENTS,
  POST_MEDIA_MAP,
  POST_LIKE_MAP,
  COMMENT_MAP,
  DEFAULT_PROFILE_IMAGE_URL,
  resolveProfileImageUrl,
  withResolvedProfileImage,
};
