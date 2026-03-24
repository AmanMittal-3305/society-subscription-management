const adminService = require("../services/adminService")


const generateBills = async (req, res) => {
  try {

    const { month } = req.body;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required (YYYY-MM-01)"
      });
    }

    const result = await adminService.generateBills(month);

    res.json({
      success: true,
      message: "Bills generated successfully",
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error generating bills",
      error: error.message
    });

  }
};

const manualPayment = async (req, res) => {
  try {

    const paymentData = req.body;

    const result = await adminService.manualPayment(paymentData);

    res.json({
      success: true,
      message: "Payment recorded successfully",
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error recording payment",
      error: error.message
    });

  }
};


const getMonthlyRecords = async (req, res) => {
  try {

    const adminId = req.user.user_id

    const result = await pool.query(
      `SELECT
        mr.record_id,
        f.flat_number,
        f.flat_type,
        mr.billing_month,
        mr.amount_due,
        mr.status
       FROM monthly_records mr
       JOIN flats f ON mr.flat_id = f.flat_id
       WHERE f.admin_id = $1
       ORDER BY mr.billing_month DESC`,
      [adminId]
    )

    res.json(result.rows)

  } catch (error) {

    console.error("Monthly Records Error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

const generateMonthlyRecords = async (req, res) => {
  try {

    const adminId = req.user.user_id
    const { billing_month } = req.body

    const flats = await pool.query(
      `SELECT flat_id, flat_type
       FROM flats
       WHERE admin_id = $1`,
      [adminId]
    )

    for (const flat of flats.rows) {

      const plan = await pool.query(
        `SELECT monthly_rate
         FROM subscription_plans
         WHERE admin_id=$1
         AND flat_type=$2
         ORDER BY effective_from DESC
         LIMIT 1`,
        [adminId, flat.flat_type]
      )

      if (!plan.rows.length) continue

      await pool.query(
        `INSERT INTO monthly_records
         (record_id, flat_id, billing_month, amount_due, status, created_at)
         VALUES (gen_random_uuid(),$1,$2,$3,'pending',CURRENT_TIMESTAMP)`,
        [
          flat.flat_id,
          billing_month,
          plan.rows[0].monthly_rate
        ]
      )
    }

    res.json({ message: "Monthly records generated" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}



module.exports = {
  //   register,
  //   login,
  // getDashboard,
  generateMonthlyRecords,
  getMonthlyRecords,
  generateBills,
  manualPayment
}