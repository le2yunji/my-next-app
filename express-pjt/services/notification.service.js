const {
  createNotification,
  findNotificationsByRecipient,
  countUnreadByRecipient,
  markOneAsRead,
  markAllAsRead,
} = require("../repositories/notification.repository");
const { findActiveUserByMongoId } = require("../repositories/user.repository");
const User = require("../models/user.model");

const SENDER_FIELDS = "userId name profileImage";

/**
 * 알림 생성
 * - 자기 자신에게는 알림을 보내지 않는다
 * - 수신자의 notificationPreferences에서 해당 type이 false면 skip
 */
const createNotificationIfAllowed = async ({
  type,
  senderId,
  recipientId,
  targetId = null,
  targetType = null,
}) => {
  // 자기 자신 알림 방지
  if (String(senderId) === String(recipientId)) return;

  const recipient = await User.findById(recipientId)
    .select("notificationPreferences")
    .lean();

  // 수신자가 없거나 해당 type 알림을 꺼놨으면 skip
  // preferences 필드가 없는 기존 유저는 기본값 true로 허용
  const prefs = recipient?.notificationPreferences;
  if (prefs && prefs[type] === false) return;

  await createNotification({
    type,
    senderId,
    recipientId,
    targetId,
    targetType,
  });
};

/**
 * 알림 목록 조회 (커서 페이지네이션)
 * - sender 정보를 populate해서 반환
 */
const getNotificationsData = async ({ recipientId, cursor, limit = 20 }) => {
  const rawItems = await findNotificationsByRecipient({
    recipientId,
    cursor,
    limit,
  });

  const hasNext = rawItems.length > limit;
  const items = hasNext ? rawItems.slice(0, limit) : rawItems;
  const nextCursor = hasNext ? String(items[items.length - 1]._id) : null;

  // sender 정보 일괄 조회
  const senderIds = [...new Set(items.map((n) => String(n.senderId)))];
  const senders = await User.find({ _id: { $in: senderIds } })
    .select(SENDER_FIELDS)
    .lean();
  const senderMap = Object.fromEntries(senders.map((u) => [String(u._id), u]));

  const mapped = items.map((n) => {
    const sender = senderMap[String(n.senderId)] ?? null;
    return {
      id: String(n._id),
      type: n.type,
      isRead: n.isRead,
      createdAt: n.createdAt,
      sender: sender
        ? {
            id: String(sender._id),
            userId: sender.userId,
            name: sender.name,
            profileImage: sender.profileImage ?? null,
          }
        : null,
      target: n.targetId
        ? { id: String(n.targetId), type: n.targetType }
        : null,
    };
  });

  return { items: mapped, nextCursor, hasNext };
};

const getUnreadCountData = async (recipientId) => {
  const count = await countUnreadByRecipient(recipientId);
  return { count };
};

const markNotificationReadData = async ({ notificationId, recipientId }) => {
  await markOneAsRead(notificationId, recipientId);
};

const markAllNotificationsReadData = async (recipientId) => {
  await markAllAsRead(recipientId);
};

/**
 * 알림 수신 설정 조회
 */
const getNotificationPreferencesData = async (mongoId) => {
  const user = await User.findById(mongoId)
    .select("notificationPreferences")
    .lean();
  // preferences가 없는 기존 유저는 전부 true로 응답
  const defaults = {
    COMMENT_LIKE: true,
    COMMENT_REPLY: true,
    POST_COMMENT: true,
    FOLLOW: true,
    POST_LIKE: true,
    BOARD_LIKE: true,
    POST_SCRAP: true,
  };
  return { ...defaults, ...user?.notificationPreferences };
};

/**
 * 알림 수신 설정 변경
 * body 예시: { COMMENT_LIKE: false, POST_LIKE: true }
 */
const updateNotificationPreferencesData = async ({ mongoId, preferences }) => {
  const VALID_TYPES = [
    "COMMENT_LIKE",
    "COMMENT_REPLY",
    "POST_COMMENT",
    "FOLLOW",
    "POST_LIKE",
    "BOARD_LIKE",
    "POST_SCRAP",
  ];

  const update = {};
  for (const type of VALID_TYPES) {
    if (typeof preferences[type] === "boolean") {
      update[`notificationPreferences.${type}`] = preferences[type];
    }
  }

  await User.updateOne({ _id: mongoId }, { $set: update });
};

module.exports = {
  createNotificationIfAllowed,
  getNotificationsData,
  getUnreadCountData,
  markNotificationReadData,
  markAllNotificationsReadData,
  getNotificationPreferencesData,
  updateNotificationPreferencesData,
};
