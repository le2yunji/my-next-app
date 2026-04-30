// controllers/users.controller.js
const { getUserProfileData } = require("../services/user-profile.service");
const { toggleFollow } = require("../services/follow.service");
const { toUserProfileResponse } = require("../mappers/user.mapper");
const { toUserPostItemResponse } = require("../mappers/posts.mapper");
const {
  getNotificationPreferencesData,
  updateNotificationPreferencesData,
} = require("../services/notification.service");

// 유저 프로필 + 유저 게시물 첫 페이지까지 함께 반환
async function getUserProfile(req, res) {
  try {
    const userId = req.params.userId;

    // 인증 미들웨어가 있다면 req.user.id 에서 가져옴
    // 비로그인 허용이면 null 처리하거나 기본값을 둘 수 있음
    const viewerId = req.user?.mongoId || null;

    const result = await getUserProfileData({
      userId,
      viewerId,
    });

    if (!result.success) {
      if (result.error.code === "USER_NOT_FOUND") {
        return res.status(404).json({
          message: result.error.message,
          code: result.error.code,
        });
      }

      return res.status(400).json({
        message: result.error.message,
        code: result.error.code,
      });
    }

    const { user, counts, relationship } = result.data;

    console.log(result.data);

    return res.status(200).json({
      profile: toUserProfileResponse({
        user,
        viewerId,
        postCount: counts.postCount,
        followerCount: counts.followerCount,
        followingCount: counts.followingCount,
        isFollowing: relationship.isFollowing,
      }),
    });
  } catch (error) {
    console.error("[GET_USER_PROFILE ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

// 유저 피드 그리드 : 썸네일 목록만 반환
async function getUserFeed(req, res) {
  try {
    const userId = req.params.userId;
    const viewerId = req.user?.mongoId || null;

    const parsed = parseInt(req.query.limit || "9", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 9 : parsed, 50);
    const cursor = req.query.cursor || null;

    const result = await getUserProfileData({
      userId,
      viewerId,
      cursor,
      limit,
    });

    if (!result.success) {
      if (result.error.code === "USER_NOT_FOUND") {
        return res.status(404).json({
          message: result.error.message,
          code: result.error.code,
        });
      }

      return res.status(400).json({
        message: result.error.message,
        code: result.error.code,
      });
    }

    const { posts, pageInfo } = result.data;

    return res.status(200).json({
      items: posts.map(({ post, mediaList }) =>
        toUserPostItemResponse({ post, mediaList }),
      ),
      nextCursor: pageInfo.nextCursor,
      hasNext: pageInfo.hasNext,
    });
  } catch (error) {
    console.error("[GET_USER_FEED ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function followUser(req, res) {
  try {
    const followerMongoId = req.user.mongoId;
    const targetUserId = req.params.userId;

    const { isFollowing } = await toggleFollow({
      followerMongoId,
      targetUserId,
    });

    return res.status(200).json({ isFollowing });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    console.error("[FOLLOW_USER ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getNotificationPreferences(req, res) {
  try {
    const prefs = await getNotificationPreferencesData(req.user.mongoId);
    return res.status(200).json({ isError: false, preferences: prefs });
  } catch (error) {
    console.error("[GET_NOTIFICATION_PREFERENCES ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateNotificationPreferences(req, res) {
  try {
    await updateNotificationPreferencesData({
      mongoId: req.user.mongoId,
      preferences: req.body,
    });
    return res.status(200).json({ isError: false });
  } catch (error) {
    console.error("[UPDATE_NOTIFICATION_PREFERENCES ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  getUserProfile,
  getUserFeed,
  followUser,
  getNotificationPreferences,
  updateNotificationPreferences,
};
