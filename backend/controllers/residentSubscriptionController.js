const pool = require("../config/db");

const getSubscriptions = async (req, res) => {
  try {
    const residentId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT 
        mr.record_id,
        mr.billing_month,
        mr.amount,
        mr.status,
        p.payment_mode,
        p.receipt_url
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      LEFT JOIN payments p ON mr.record_id = p.record_id
      WHERE f.resident_id = $1
      ORDER BY mr.created_at DESC
      `,
      [residentId]
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error("Subscription Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSubscriptionDetails = async (req, res) => {
  try {
    const residentId = req.user.user_id;
    const { id } = req.params;

    console.log("Resident:", residentId);
    console.log("Record:", id);

    const result = await pool.query(
  `
  SELECT 
    mr.*,
    f.resident_id,
    p.payment_mode,
    p.receipt_url,
    p.payment_date
  FROM monthly_records mr
  JOIN flats f ON mr.flat_id = f.flat_id
  LEFT JOIN payments p ON mr.record_id = p.record_id
  WHERE mr.record_id = $1
  `,
  [id]
);

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionDetails,
};
