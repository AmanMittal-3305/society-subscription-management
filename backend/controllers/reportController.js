const pool = require("../config/db");

exports.getMonthlyReport = async (req, res) => {

  const month  = req.query.month;

  try {

    // Total collection
    const totalCollection = await pool.query(
      `SELECT COALESCE(SUM(p.amount_paid),0) AS total
       FROM payments p
       JOIN monthly_records m
       ON p.record_id = m.record_id
       WHERE DATE_TRUNC('month', m.billing_month) = DATE_TRUNC('month',$1::date)`,
      [month]
    );



    // Pending amount
    const pendingAmount = await pool.query(
      `SELECT COALESCE(SUM(mr.amount),0) AS total
       FROM monthly_records mr
       join flats f on mr.flat_id = f.flat_id
       WHERE DATE_TRUNC('month', mr.billing_month) = DATE_TRUNC('month',$1::date)
       AND mr.status!='PAID'
       AND f.resident_id IS NOT NULL`,
      [month]
    );



    // Paid flats
    const paidflats = await pool.query(
      `SELECT COUNT(*) AS paid FROM monthly_records where status = 'PAID' AND DATE_TRUNC('month', billing_month) = DATE_TRUNC('month',$1::date)`,
      [month]
    );

    // Pending flats
    const pendingFlats = await pool.query(
      `SELECT COUNT(*) AS pending FROM monthly_records where status = 'PENDING' AND DATE_TRUNC('month', billing_month) = DATE_TRUNC('month',$1::date)`,
      [month]
    );



    // Payment mode breakdown
    const paymentModes = await pool.query(
      `SELECT payment_mode,
       SUM(amount_paid) AS total
       FROM payments
       WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month',$1::date)
       GROUP BY payment_mode`,
      [month]
    );



    res.json({

      month,

      total_collection: totalCollection.rows[0].total,

      pending_amount: pendingAmount.rows[0].total,

      paid_flats: paidflats.rows[0].paid,

      pending_flats: pendingFlats.rows[0].pending,

      payment_modes: paymentModes.rows

    });

  } catch (err) {

    console.error("REPORT ERROR:", err);

    res.status(500).json({
      message: "Report generation failed",
      error: err.message
    });

  }

};