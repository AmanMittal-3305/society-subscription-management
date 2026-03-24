const {
  createBatchId,
  getAllResidentsWithToken,
  insertNotification,
  getUserToken,
  getNotificationCount,
  getNotificationsPaginated,
  getAllResidents,
  sendPushNotification
} = require("../services/notificationService");

const sendNotification = async (req, res) => {
  try {
    const { title, message, recipient_ids, send_to_all } = req.body;
    const adminId = req.user.user_id;

    const batchId = await createBatchId();

    if (send_to_all) {
      const residents = await getAllResidentsWithToken();

      for (const resident of residents) {
        await insertNotification(title, message, resident.user_id, adminId, batchId);

        if (resident.fcm_token) {
          await sendPushNotification(resident.fcm_token, title, message);
        }
      }

    } else {
      for (const residentId of recipient_ids) {
        await insertNotification(title, message, residentId, adminId, batchId);

        const token = await getUserToken(residentId);

        if (token) {
          await sendPushNotification(token, title, message);
        }
      }
    }

    res.json({ success: true });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const total = await getNotificationCount();
    const rows = await getNotificationsPaginated(limit, offset);

    const formatted = rows.map((row) => {
      const names = row.recipients?.split(",").map(name => name.trim()) || [];

      let shortRecipients = "";

      if (names.length <= 2) {
        shortRecipients = names.join(", ");
      } else {
        shortRecipients = `${names[0]}, ${names[1]} + ${names.length - 2} others`;
      }

      return {
        ...row,
        recipients: shortRecipients
      };
    });

    res.json({
      notifications: formatted,
      totalPages: Math.ceil(total / limit)
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

const getAllResidentsController = async (req, res) => {
  try {
    const residents = await getAllResidents();
    res.json(residents);

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  getAllResidents: getAllResidentsController
};