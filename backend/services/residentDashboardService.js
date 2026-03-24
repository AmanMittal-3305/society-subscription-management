const pool = require("../config/db");

const getResidentDashboard = async (residentId) => {
  const client = await pool.connect();

  try {
    const flatRes = await client.query(
      `
      SELECT flat_id, flat_number, flat_type, owner_name, address, resident_id
      FROM flats
      WHERE resident_id = $1
      LIMIT 1
      `,
      [residentId]
    );

    if (flatRes.rows.length === 0) {
  return {
    flat: null,
    currentRecordId: null,
    currentMonth: null,
    paidAmount: 0,
    pendingAmount: 0,
    paymentHistory: [],
    notifications: []
  };
}

    const flat = flatRes.rows[0];
    const currentMonthRes = await client.query(
      `
      SELECT record_id, amount, status, billing_month
      FROM monthly_records
      WHERE flat_id = $1
      AND DATE_TRUNC('month', billing_month) = DATE_TRUNC('month', CURRENT_DATE)
      LIMIT 1
      `,
      [flat.flat_id]
    );

    let paidAmount = 0;

    if (currentMonthRes.rows.length > 0) {
      const paymentRes = await client.query(
        `
        SELECT COALESCE(SUM(amount_paid),0) as total_paid
        FROM payments
        WHERE record_id = $1
        `,
        [currentMonthRes.rows[0].record_id]
      );

      paidAmount = Number(paymentRes.rows[0].total_paid);
    }

    const historyRes = await client.query(
      `
      SELECT 
        mr.record_id,
        mr.billing_month,
        mr.amount,
        mr.status,
        COALESCE(SUM(p.amount_paid),0) as paid
      FROM monthly_records mr
      LEFT JOIN payments p ON mr.record_id = p.record_id
      WHERE mr.flat_id = $1
      GROUP BY mr.record_id, mr.billing_month, mr.amount, mr.status
      ORDER BY mr.billing_month DESC
      `,
      [flat.flat_id]
    );

    const notificationRes = await client.query(
      `
      SELECT notification_id, title, message, is_read, sent_at
      FROM notifications
      WHERE recipient_id = $1
      ORDER BY sent_at DESC
      LIMIT 5
      `,
      [residentId]
    );

    console.log("Current Record ID:", currentMonthRes.rows[0]?.record_id);

    return {
      flat,
      currentRecordId:
    currentMonthRes.rows.length > 0
      ? currentMonthRes.rows[0].record_id
      : null,
      
      

      currentMonth:
        currentMonthRes.rows.length > 0
          ? {
              ...currentMonthRes.rows[0],
              paid: paidAmount
            }
          : null,

      paidAmount,

      pendingAmount:
        currentMonthRes.rows.length > 0
          ? Number(currentMonthRes.rows[0].amount) - paidAmount
          : 0,

      paymentHistory: historyRes.rows,

      notifications: notificationRes.rows
    };

  } finally {
    client.release();
  }
};

module.exports = {
  getResidentDashboard
};