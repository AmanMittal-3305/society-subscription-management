const pool = require("../config/db");

const getResidentNotificationsService = async (residentId, page, limit) => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE recipient_id = $1
    ORDER BY sent_at DESC
    LIMIT $2 OFFSET $3
    `,
    [residentId, limit, offset]
  );

  const total = await pool.query(
    `
    SELECT COUNT(*)
    FROM notifications
    WHERE recipient_id = $1
    `,
    [residentId]
  );

  return {
    notifications: result.rows,
    total: Number(total.rows[0].count),
  };
};

const markAllReadService = async (residentId) => {
  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE recipient_id = $1
    `,
    [residentId]
  );
};

const unreadNotificationsService = async (residentId) => {
  const result = await pool.query(
    `
    SELECT COUNT(*)
    FROM notifications
    WHERE recipient_id = $1
    AND is_read = false
    `,
    [residentId]
  );

  return Number(result.rows[0].count);
};

const saveFCMTokenService = async (userId, token) => {
  await pool.query(
    `
    UPDATE users
    SET fcm_token = $1
    WHERE user_id = $2
    `,
    [token, userId]
  );
};

module.exports = {
  getResidentNotificationsService,
  markAllReadService,
  unreadNotificationsService,
  saveFCMTokenService,
};