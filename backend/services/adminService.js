const pool = require("../config/db")

// GET MONTHLY RECORDS
const getMonthlyRecords = async (month) => {

  const query = `
  SELECT mr.record_id, f.flat_number, f.flat_type, mr.billing_month, mr.amount_due, mr.status
  FROM monthly_records mr
  JOIN flats f ON mr.flat_id = f.flat_id
  WHERE mr.billing_month = $1
  ORDER BY f.flat_number
  `;

  const result = await pool.query(query, [month]);

  return result.rows;
};



// GENERATE MONTHLY RECORDS
const generateMonthlyRecords = async (month) => {

  const flats = await pool.query(`
    SELECT flat_id, flat_type
    FROM flats
    WHERE is_active = true
  `);

  const generatedRecords = [];

  for (let flat of flats.rows) {

    const plan = await pool.query(
      `SELECT monthly_rate
       FROM subscription_plans
       WHERE flat_type = $1`,
      [flat.flat_type]
    );

    if (plan.rows.length === 0) continue;

    const amount = plan.rows[0].monthly_rate;

    const existing = await pool.query(
      `SELECT * FROM monthly_records
       WHERE flat_id = $1 AND billing_month = $2`,
      [flat.flat_id, month]
    );

    if (existing.rows.length === 0) {

      const record = await pool.query(
        `INSERT INTO monthly_records
         (flat_id, billing_month, amount_due, status)
         VALUES ($1,$2,$3,'pending')
         RETURNING *`,
        [flat.flat_id, month, amount]
      );

      generatedRecords.push(record.rows[0]);
    }
  }

  return generatedRecords;
};

const generateBills = async (month) => {

  const flats = await pool.query(`
      SELECT flat_id, flat_type
      FROM flats
      WHERE is_active = true
  `);

  const generatedBills = [];

  for (let flat of flats.rows) {

    const plan = await pool.query(
      `SELECT monthly_rate
       FROM subscription_plans
       WHERE flat_type = $1`,
      [flat.flat_type]
    );

    if (plan.rows.length === 0) continue;

    const amount = plan.rows[0].monthly_rate;

    const existing = await pool.query(
      `SELECT record_id
       FROM monthly_records
       WHERE flat_id = $1
       AND billing_month = $2`,
      [flat.flat_id, month]
    );

    if (existing.rows.length > 0) continue;

    const record = await pool.query(
      `INSERT INTO monthly_records
      (flat_id, billing_month, amount_due, status)
      VALUES ($1,$2,$3,'pending')
      RETURNING *`,
      [flat.flat_id, month, amount]
    );

    generatedBills.push(record.rows[0]);
  }

  return generatedBills;
};

const manualPayment = async (data) => {

  const {record_id,amount_paid, payment_mode, transaction_id, recorded_by} = data;

  // insert payment
  const payment = await pool.query(
    `INSERT INTO payments
    (record_id, amount_paid, payment_mode, transaction_id, recorded_by)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [record_id, amount_paid, payment_mode, transaction_id, recorded_by]
  );

  // update monthly record status
  await pool.query(
    `UPDATE monthly_records
     SET status = 'paid'
     WHERE record_id = $1`,
    [record_id]
  );

  return payment.rows[0];
};

module.exports = {
  getMonthlyRecords,
  generateMonthlyRecords,
  generateBills,
  manualPayment
}