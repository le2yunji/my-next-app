// services/post-detaill.service.js

const { buildPostDetailBase } = require("./post-detail-base.service");

const getPostDetailData = ({ postId, viewerId = null }) => {
  return buildPostDetailBase({ postId, viewerId });
};

module.exports = { getPostDetailData };
