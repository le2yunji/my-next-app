const notificationsRouter = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
} = require("../controllers/notifications.controller");

notificationsRouter.get("/", authenticate, getNotifications);
notificationsRouter.get("/unread-count", authenticate, getUnreadCount);
notificationsRouter.patch("/read-all", authenticate, markAllRead);
notificationsRouter.patch("/:notificationId/read", authenticate, markAsRead);

module.exports = notificationsRouter;
