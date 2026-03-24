const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createCurrentMonthRecord = async (flat_id, amount) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const existing = await client.query(
      `
      SELECT record_id
      FROM monthly_records
      WHERE flat_id = $1
      AND DATE_TRUNC('month', billing_month) = DATE_TRUNC('month', CURRENT_DATE)
      `,
      [flat_id]
    )

    if (existing.rows.length > 0) {
      await client.query("COMMIT")
      return
    }

    await client.query(
      `
      INSERT INTO monthly_records (
        record_id,
        flat_id,
        billing_month,
        amount,
        status
      )
      VALUES (
        $1,
        $2,
        DATE_TRUNC('month', CURRENT_DATE),
        $3,
        'PENDING'
      )
      `,
      [
        uuidv4(),
        flat_id,
        amount
      ]
    )

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}


// Get monthly records
const getMonthlyRecords = async (admin_id, month, page = 1, limit = 5) => {
  const offset = (page - 1) * limit

  const totalRes = await pool.query(
    `
    SELECT COUNT(*) 
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id = f.flat_id
    WHERE f.admin_id = $1
    AND f.resident_id IS NOT NULL
    AND DATE_TRUNC('month', mr.billing_month) = DATE_TRUNC('month', $2::DATE)
    `,
    [admin_id, month]
  )

  const result = await pool.query(
    `
    SELECT 
      mr.record_id,
      mr.flat_id,
      mr.billing_month,
      mr.amount,
      mr.status,
      f.flat_number,
      f.flat_type,
      f.owner_name
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id = f.flat_id
    WHERE f.admin_id = $1
    AND f.resident_id IS NOT NULL
    AND DATE_TRUNC('month', mr.billing_month) = DATE_TRUNC('month', $2::DATE)
    ORDER BY f.flat_number
    LIMIT $3 OFFSET $4
    `,
    [admin_id, month, limit, offset]
  )

  return {
    records: result.rows,
    totalPages: Math.ceil(totalRes.rows[0].count / limit),
  }
}
// Mark record as paid
const markAsPaid = async (record_id, admin_id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recordRes = await client.query(
      `
      SELECT mr.*, f.admin_id
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE mr.record_id = $1
      AND f.resident_id IS NOT NULL
      `,
      [record_id]
    );

    if (!recordRes.rows.length) {
      throw new Error("Record not found");
    }

    const record = recordRes.rows[0];

    if (record.admin_id !== admin_id) {
      throw new Error("Unauthorized");
    }

    if (record.status === "PAID") {
      throw new Error("Already paid");
    }

    const existingPayment = await client.query(
      `SELECT payment_id FROM payments WHERE record_id = $1`,
      [record_id]
    );

    if (existingPayment.rows.length) {
      throw new Error("Payment already exists");
    }

    await client.query(
      `
      INSERT INTO payments
      (payment_id, record_id, amount_paid, payment_mode, payment_source, transaction_id, recorded_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        uuidv4(),
        record.record_id,
        record.amount,
        "CASH",
        "OFFLINE",
        null,
        admin_id
      ]
    );

    await client.query(
      `
      UPDATE monthly_records
      SET status='PAID'
      WHERE record_id=$1
      `,
      [record_id]
    );

    await client.query("COMMIT");

    return { message: "Payment recorded successfully" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getMonthlyRecords,
  markAsPaid,
  createCurrentMonthRecord
};