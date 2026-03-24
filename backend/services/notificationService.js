const pool = require("../config/db");
const admin = require("../config/firebase"); 

const sendPushNotification = async (deviceToken, title, body) => 
  { 
    try { 
      const message = { notification: { title, body, }, token: deviceToken, }; 
      await admin.messaging().send(message); 
    } catch (e) { 
      console.error("Firebase send error:", e.message); 
    } 
  };

const createBatchId = async () => {
  const result = await pool.query(`SELECT gen_random_uuid() AS id`);
  return result.rows[0].id;
};

const getAllResidentsWithToken = async () => {
  const result = await pool.query(`
    SELECT user_id, full_name, fcm_token
    FROM users
    WHERE role = 'RESIDENT'
  `);

  return result.rows;
};

const insertNotification = async (title, message, recipientId, senderId, batchId) => {
  await pool.query(
    `
    INSERT INTO notifications
    (title, message, recipient_id, sender_id, batch_id)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [title, message, recipientId, senderId, batchId]
  );
};

const getUserToken = async (userId) => {
  const result = await pool.query(
    `
    SELECT fcm_token
    FROM users
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0]?.fcm_token;
};

const getNotificationCount = async () => {
  const result = await pool.query(`
    SELECT COUNT(DISTINCT batch_id)
    FROM notifications
  `);

  return result.rows[0].count;
};

const getNotificationsPaginated = async (limit, offset) => {
  const result = await pool.query(
    `
    SELECT
      n.batch_id,
      n.title,
      n.message,
      MAX(n.sent_at) AS sent_at,
      STRING_AGG(u.full_name, ', ') AS recipients
    FROM notifications n
    LEFT JOIN users u ON n.recipient_id = u.user_id
    GROUP BY n.batch_id, n.title, n.message
    ORDER BY MAX(n.sent_at) DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return result.rows;
};

const getAllResidents = async () => {
  const result = await pool.query(`
    SELECT user_id, full_name
    FROM users
    WHERE role = 'RESIDENT'
    ORDER BY full_name
  `);

  return result.rows;
};

module.exports = {
  createBatchId,
  getAllResidentsWithToken,
  insertNotification,
  getUserToken,
  getNotificationCount,
  getNotificationsPaginated,
  getAllResidents,
  sendPushNotification
};