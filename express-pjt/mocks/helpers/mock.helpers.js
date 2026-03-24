// mocks/mock.helper.js
const {
  buildProfileImagePath,
  buildFeedImagePath,
  resolveProfileImageUrl,
} = require("../../constants/image-paths");

const createUser = ({
  id,
  nickname,
  name,
  bio = "",
  profileImageNo = null,
}) => {
  return {
    id,
    nickname,
    name,
    bio,
    profileImageUrl: buildProfileImagePath(profileImageNo),
  };
};

const createBasePost = ({ id, authorId, content, createdAt }) => {
  return {
    id,
    authorId,
    content,
    createdAt,
  };
};

const createPost = ({
  id,
  authorId,
  content,
  createdAt,
  likeCount,
  commentCount,
}) => {
  return {
    id,
    authorId,
    content,
    createdAt,
    likeCount,
    commentCount,
  };
};

const createPostMedia = ({
  postId,
  imageNo,
  order = 1,
  type = "image",
  width = 1080,
  height = 1080,
}) => {
  const imageUrl = buildFeedImagePath(imageNo);

  return {
    id: `${postId}_media_${order}`,
    postId,
    type,
    url: imageUrl,
    thumbnailUrl: imageUrl,
    displayUrl: imageUrl,
    fullUrl: imageUrl,
    width,
    height,
    order,
  };
};

const createFollow = ({ followerId, followingId, createdAt }) => {
  return {
    id: `${followerId}_follows_${followingId}`,
    followerId,
    followingId,
    createdAt,
  };
};

const createPostLike = ({ postId, userId, createdAt }) => {
  return {
    id: `${postId}_like_${userId}`,
    postId,
    userId,
    createdAt,
  };
};

const createComment = ({ id, postId, authorId, content, createdAt }) => {
  return {
    id,
    postId,
    authorId,
    content,
    createdAt,
  };
};

const withResolvedProfileImage = (user) => {
  return {
    ...user,
    profileImageUrl: resolveProfileImageUrl(user.profileImageUrl),
  };
};

module.exports = {
  createUser,
  createBasePost,
  createPost,
  createPostMedia,
  createFollow,
  createPostLike,
  createComment,
  withResolvedProfileImage,
};
