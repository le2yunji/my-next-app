const User = require("../models/user.model");

const USER_SUMMARY_SELECT = "_id userId name profileImage";

/**
 * 공개용 userId 기준으로 활성 사용자 1명 조회
 *
 * 사용 예:
 * - /users/:userId/profile
 * - /users/:userId/posts/:postId
 */
const findActiveUserSummaryByUserId = (userId) => {
  return User.findOne({
    userId,
    isDeleted: false,
  })
    .select(USER_SUMMARY_SELECT)
    .lean();
};

/**
 * 여러 MongoDB _id 기준으로 활성 사용자 요약 정보 조회
 *
 * 사용 예:
 * - 댓글 목록에서 작성자 여러 명 한 번에 조회
 * - authorId(ObjectId) 배열 기반 조회
 */
const findActiveUsersSummaryByMongoIds = (mongoIds = []) => {
  return User.find({
    _id: { $in: mongoIds },
    isDeleted: false,
  })
    .select(USER_SUMMARY_SELECT)
    .lean();
};

module.exports = {
  findActiveUserSummaryByUserId,
  findActiveUsersSummaryByMongoIds,
};
