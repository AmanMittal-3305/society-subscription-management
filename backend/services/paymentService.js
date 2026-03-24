const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

// GET unpaid flat
const getPaymentEntry = async (admin_id, month) => {

  const query = `
  SELECT
    mr.record_id,
    f.flat_number,
    f.flat_type,
    mr.amount,
    mr.status
  FROM monthly_records mr
  JOIN flats f ON f.flat_id = mr.flat_id
  WHERE f.admin_id = $1
  AND DATE_TRUNC('month', mr.billing_month) = DATE_TRUNC('month', $2::date)
  AND mr.status != 'PAID'
  ORDER BY f.flat_number
  `

  const result = await pool.query(query, [admin_id, month])

  return result.rows
}


// CREATE PAYMENT
const createPaymentEntry = async (data, admin_id) => {

  const {
    record_id,
    payment_mode,
    payment_source,
    transaction_id
  } = data

  const client = await pool.connect()

  try{

    await client.query("BEGIN")

    const recordRes = await client.query(
      `SELECT amount FROM monthly_records WHERE record_id=$1`,
      [record_id]
    )

    if(recordRes.rows.length === 0){
      throw new Error("Record not found")
    }

    const amount = recordRes.rows[0].amount


    await client.query(
      `
      INSERT INTO payments
      (
        payment_id,
        record_id,
        amount_paid,
        payment_mode,
        payment_source,
        transaction_id,
        recorded_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        uuidv4(),
        record_id,
        amount,
        payment_mode,
        payment_source,
        transaction_id || null,
        admin_id
      ]
    )


    await client.query(
      `
      UPDATE monthly_records
      SET status = 'PAID'
      WHERE record_id = $1
      `,
      [record_id]
    )

    await client.query("COMMIT")

    return { message:"Payment successful" }

  }catch(err){

    await client.query("ROLLBACK")
    throw err

  }finally{

    client.release()

  }

}

// RESIDENT PAYMENT
const payNow = async (data, resident_id) => {
  const { record_id, payment_mode } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recordRes = await client.query(
      `
      SELECT 
        mr.record_id,
        mr.amount,
        mr.status,
        f.flat_id,
        f.resident_id
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE mr.record_id = $1
      AND f.resident_id = $2
      `,
      [record_id, resident_id]
    );

    if (recordRes.rows.length === 0) {
      throw new Error("This payment record does not belong to your flat");
    }

    if (recordRes.rows[0].status === "PAID") {
      throw new Error("Already paid");
    }

    const amount = recordRes.rows[0].amount;

    await client.query(
      `
      INSERT INTO payments
      (
        payment_id,
        record_id,
        amount_paid,
        payment_mode,
        payment_source,
        recorded_by
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        uuidv4(),
        record_id,
        amount,
        payment_mode,
        "ONLINE",
        resident_id
      ]
    );

    await client.query(
      `
      UPDATE monthly_records
      SET status = 'PAID'
      WHERE record_id = $1
      `,
      [record_id]
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "Payment successful"
    };

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;

  } finally {
    client.release();
  }
};




module.exports = {
  getPaymentEntry,
  createPaymentEntry,
  payNow
}