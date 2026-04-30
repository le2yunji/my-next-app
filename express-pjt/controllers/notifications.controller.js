const {
  getNotificationsData,
  getUnreadCountData,
  markNotificationReadData,
  markAllNotificationsReadData,
} = require("../services/notification.service");

async function getNotifications(req, res) {
  try {
    const recipientId = req.user.mongoId;
    const { cursor = null } = req.query;
    const parsed = parseInt(req.query.limit || "20", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 20 : parsed, 50);

    const result = await getNotificationsData({ recipientId, cursor, limit });
    return res.status(200).json({ isError: false, ...result });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ isError: true, message: "서버 에러가 발생했습니다." });
  }
}

async function getUnreadCount(req, res) {
  try {
    const result = await getUnreadCountData(req.user.mongoId);
    return res.status(200).json({ isError: false, ...result });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    return res.status(500).json({ isError: true, message: "서버 에러가 발생했습니다." });
  }
}

async function markAsRead(req, res) {
  try {
    await markNotificationReadData({
      notificationId: req.params.notificationId,
      recipientId: req.user.mongoId,
    });
    return res.status(200).json({ isError: false });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ isError: true, message: "서버 에러가 발생했습니다." });
  }
}

async function markAllRead(req, res) {
  try {
    await markAllNotificationsReadData(req.user.mongoId);
    return res.status(200).json({ isError: false });
  } catch (error) {
    console.error("markAllRead error:", error);
    return res.status(500).json({ isError: true, message: "서버 에러가 발생했습니다." });
  }
}

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllRead };
