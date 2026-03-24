const {
  getResidentNotificationsService,
  markAllReadService,
  unreadNotificationsService,
  saveFCMTokenService,
} = require("../services/residentNotificationService");

const saveFCMToken = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { token } = req.body;

    await saveFCMTokenService(userId, token);

    res.json({
      success: true,
      message: "Token saved",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const residentId = req.user.user_id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const data = await getResidentNotificationsService(
      residentId,
      page,
      limit
    );

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
    });
  }
};

const unreadNotifications = async (req, res) => {
  try {
    const residentId = req.user.user_id;

    const unread = await unreadNotificationsService(residentId);

    res.json({
      unread,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
    });
  }
};

const readNotifications = async (req, res) => {
  try {
    const residentId = req.user.user_id;

    await markAllReadService(residentId);

    res.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  saveFCMToken,
  getNotifications,
  unreadNotifications,
  readNotifications,
};