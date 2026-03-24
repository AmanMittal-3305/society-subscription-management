const pool = require("../config/db")

// GET ALL PLANS
const getPlans = async (admin_id) => {
  const today = new Date()

  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const result = await pool.query(
    `
    SELECT
      current.plan_id,
      current.flat_type,
      current.monthly_rate AS current_rate,
      COALESCE(next.monthly_rate, current.monthly_rate) AS next_rate
    FROM subscription_plans current
    LEFT JOIN subscription_plans next
      ON current.admin_id = next.admin_id
      AND current.flat_type = next.flat_type
      AND next.effective_from = $2
    WHERE current.admin_id = $1
      AND current.effective_from = (
        SELECT MAX(effective_from)
        FROM subscription_plans sp
        WHERE sp.admin_id = current.admin_id
          AND sp.flat_type = current.flat_type
          AND sp.effective_from <= $3
      )
    ORDER BY current.flat_type
    `,
    [admin_id, nextMonth, currentMonth]
  )

  return result.rows
}

// GET SINGLE PLAN
const getPlanById = async (admin_id, plan_id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
    [plan_id, admin_id]
  )

  return result.rows[0]
}

// CREATE PLAN
const createPlan = async ({
  admin_id,
  flat_type,
  monthly_rate
}) => {

  const today = new Date()

  const monthStartDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const result = await pool.query(
    `
    INSERT INTO subscription_plans
    (admin_id, flat_type, monthly_rate, effective_from)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      admin_id,
      flat_type,
      monthly_rate,
      monthStartDate
    ]
  )

  return result.rows[0]
}

// UPDATE PLAN
const updatePlan = async (admin_id, plan_id, { monthly_rate }) => {

  const today = new Date()

  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const oldPlan = await pool.query(
    `
    SELECT flat_type
    FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
    [plan_id, admin_id]
  )

  if (!oldPlan.rows.length) return null

  const flat_type = oldPlan.rows[0].flat_type

  const result = await pool.query(
  `
  INSERT INTO subscription_plans
  (admin_id, flat_type, monthly_rate, effective_from)
  VALUES ($1,$2,$3,$4)
  ON CONFLICT (admin_id, flat_type, effective_from)
  DO UPDATE SET monthly_rate = EXCLUDED.monthly_rate
  RETURNING *
  `,
  [admin_id, flat_type, monthly_rate, nextMonth]
)

  return result.rows[0]
}

// DELETE PLAN
const deletePlan = async (admin_id, plan_id) => {

  await pool.query(
    `
    DELETE FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
    [plan_id, admin_id]
  )
}

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
}