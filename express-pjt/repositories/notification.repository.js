const Notification = require("../models/notification.model");

// 알림 문서 생성
const createNotification = (data) => {
  return Notification.create(data);
};

// 특정 수신자의 알림 목록 조회 (최신순 커서 페이지네이션)
const findNotificationsByRecipient = async ({ recipientId, cursor, limit }) => {
  const query = { recipientId };
  if (cursor) {
    query._id = { $lt: cursor };
  }
  return Notification.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();
};

// 특정 수신자의 읽지 않은 알림 수 집계
const countUnreadByRecipient = (recipientId) => {
  return Notification.countDocuments({ recipientId, isRead: false });
};

// 특정 알림 1개를 읽음 처리 (수신자 검증 포함)
const markOneAsRead = (notificationId, recipientId) => {
  return Notification.updateOne(
    { _id: notificationId, recipientId },
    { $set: { isRead: true } },
  );
};

// 특정 수신자의 읽지 않은 알림 전체를 읽음 처리
const markAllAsRead = (recipientId) => {
  return Notification.updateMany(
    { recipientId, isRead: false },
    { $set: { isRead: true } },
  );
};

module.exports = {
  createNotification,
  findNotificationsByRecipient,
  countUnreadByRecipient,
  markOneAsRead,
  markAllAsRead,
};
