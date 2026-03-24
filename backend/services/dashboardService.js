const pool = require("../config/db")

const getDashboardData = async (admin_id) => {

  // Total flats
  const flatsRes = await pool.query(
    `SELECT COUNT(*) AS total FROM flats WHERE admin_id=$1`,
    [admin_id]
  )

  const total_flats = parseInt(flatsRes.rows[0].total)


  // Total residents
  const residentsRes = await pool.query(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE role='RESIDENT'`
  )

  const total_residents = parseInt(residentsRes.rows[0].total)


  // Total collected
  const collectedRes = await pool.query(
    `
    SELECT COALESCE(SUM(mr.amount),0) AS total
    FROM monthly_records mr
    JOIN flats f ON f.flat_id = mr.flat_id
    WHERE mr.status='PAID'
    AND f.admin_id=$1
    `,
    [admin_id]
  )

  const total_collected = parseFloat(collectedRes.rows[0].total)


  // Total pending
  const pendingRes = await pool.query(
    `
    SELECT COALESCE(SUM(mr.amount),0) AS total
    FROM monthly_records mr
    JOIN flats f ON f.flat_id = mr.flat_id
    WHERE mr.status='PENDING'
    AND f.admin_id=$1
    AND f.resident_id IS NOT NULL
    `,
    [admin_id]
  )

  const total_pending = parseFloat(pendingRes.rows[0].total)


  // Recent transactions
  const transactionsRes = await pool.query(
    `
    SELECT
      mr.record_id AS id,
      f.flat_number AS flat,
      mr.billing_month AS date,
      mr.amount,
      mr.status
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id=f.flat_id
    WHERE f.admin_id=$1
    ORDER BY mr.created_at DESC
    LIMIT 5
    `,
    [admin_id]
  )


  // Revenue analytics
  const revenueRes = await pool.query(
    `
    SELECT
      TO_CHAR(DATE_TRUNC('month', mr.billing_month),'Mon') AS month,
      SUM(mr.amount) AS amount
    FROM monthly_records mr
    JOIN flats f ON f.flat_id = mr.flat_id
    WHERE mr.status='PAID'
    AND f.admin_id=$1
    AND f.resident_id IS NOT NULL
    GROUP BY DATE_TRUNC('month', mr.billing_month)
    ORDER BY DATE_TRUNC('month', mr.billing_month)
    LIMIT 6
    `,
    [admin_id]
  )


  return {
    total_flats,
    total_residents,
    total_collected,
    total_pending,
    recent_transactions: transactionsRes.rows,
    revenue_analytics:{
      months: revenueRes.rows.map(r=>r.month),
      amounts: revenueRes.rows.map(r=>Number(r.amount))
    }
  }
}

module.exports = { getDashboardData }