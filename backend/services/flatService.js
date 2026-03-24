const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")

//GET FLATS
const getAllFlats = async (adminId, page = 1, limit = 5, search = "") => {
  const offset = (page - 1) * limit
  const searchCondition = `%${search}%`

  const result = await pool.query(
    `
    SELECT
      f.flat_id,
      f.flat_number,
      f.flat_type,
      f.owner_name,
      f.owner_email,
      f.owner_phone,
      f.address,
      f.resident_id,
      f.is_active,
      u.full_name AS resident_name
    FROM flats f
    LEFT JOIN users u
      ON f.resident_id = u.user_id
    WHERE f.admin_id = $1
      AND f.flat_number ILIKE $2
    ORDER BY f.flat_number
    LIMIT $3 OFFSET $4
    `,
    [adminId, searchCondition, limit, offset]
  )

  const countResult = await pool.query(
    `
    SELECT COUNT(*)
    FROM flats
    WHERE admin_id = $1
      AND flat_number ILIKE $2
    `,
    [adminId, searchCondition]
  )

  return {
    flats: result.rows,
    total: parseInt(countResult.rows[0].count),
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  }
}


// CREATE FLAT

const createFlat = async ({
  flat_number,
  flat_type,
  address,
  owner_name,
  owner_email,
  owner_phone,
  assign_flat_itself,
  admin_id
}) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    let residentId = null

    if (owner_email) {
      const existing = await client.query(
        `
        SELECT user_id
        FROM users
        WHERE email = $1
        `,
        [owner_email]
      )

      if (existing.rows.length > 0) {
        residentId = existing.rows[0].user_id
      } else {
        residentId = uuidv4()

        const hashedPassword = await bcrypt.hash("Society@123", 10)

        await client.query(
          `
          INSERT INTO users
          (
            user_id,
            email,
            password_hash,
            full_name,
            phone_number,
            role
          )
          VALUES ($1,$2,$3,$4,$5,$6)
          `,
          [
            residentId,
            owner_email,
            hashedPassword,
            owner_name,
            owner_phone,
            "RESIDENT"
          ]
        )
      }
    }

    const finalResidentId = assign_flat_itself ? residentId : null

    const flatResult = await client.query(
      `
      INSERT INTO flats
      (
        flat_number,
        owner_name,
        flat_type,
        address,
        owner_email,
        owner_phone,
        admin_id,
        resident_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        flat_number,
        owner_name,
        flat_type,
        address,
        owner_email,
        owner_phone,
        admin_id,
        finalResidentId
      ]
    )

    const flat = flatResult.rows[0]

    if (finalResidentId) {
      const sub = await client.query(
  `
  SELECT monthly_rate
  FROM subscription_plans
  WHERE admin_id = $1
  AND flat_type = $2
  AND effective_from <= DATE_TRUNC('month', CURRENT_DATE)
  ORDER BY effective_from DESC
  LIMIT 1
  `,
  [admin_id, flat_type]
)

      const rate = sub.rows[0]?.monthly_rate || 0

      const existingRecord = await client.query(
        `
        SELECT *
        FROM monthly_records
        WHERE flat_id = $1
        AND billing_month = date_trunc('month', CURRENT_DATE)
        `,
        [flat.flat_id]
      )

      if (!existingRecord.rows.length) {
        await client.query(
          `
          INSERT INTO monthly_records
          (
            record_id,
            flat_id,
            billing_month,
            amount,
            status
          )
          VALUES ($1,$2,date_trunc('month', CURRENT_DATE),$3,'PENDING')
          `,
          [
            uuidv4(),
            flat.flat_id,
            rate
          ]
        )
      }
    }

    await client.query("COMMIT")

    return flat

  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

// UPDATE FLAT
const updateFlat = async (id, data) => {
  const { flat_number, flat_type, owner_name, owner_email, owner_phone, address } = data

  const result = await pool.query(
    `
    UPDATE flats
    SET
      flat_number = $1,
      flat_type = $2,
      owner_name = $3,
      owner_email = $4,
      owner_phone = $5,
      address = $6
    WHERE flat_id = $7
    RETURNING *
    `,
    [flat_number, flat_type, owner_name, owner_email, owner_phone, address, id]
  )

  return result.rows[0]
}

// DELETE FLAT
const deleteFlat = async (id) => {
  const result = await pool.query(
    `
    UPDATE flats
    SET is_active = false
    WHERE flat_id = $1
      AND resident_id IS NULL
    RETURNING *
    `,
    [id]
  )

  return result.rows[0]
}

// RESTORE FLAT
const restoreFlat = async (id) => {
  const result = await pool.query(
    `
    UPDATE flats
    SET is_active = true
    WHERE flat_id = $1
    RETURNING *
    `,
    [id]
  )

  return result.rows[0]
}

// AVAILABLE RESIDENTS
const getAvailableResidents = async () => {
  const result = await pool.query(
    `
    SELECT u.user_id, u.full_name, u.email
    FROM users u
    LEFT JOIN flats f
      ON u.user_id = f.resident_id
    WHERE u.role = 'RESIDENT'
      AND f.resident_id IS NULL
    ORDER BY u.full_name
    `
  )

  return result.rows
}

// ASSIGN RESIDENT
const assignResident = async (flatId, residentId) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const flatCheck = await client.query(
      `
      SELECT *
      FROM flats
      WHERE flat_id = $1
      `,
      [flatId]
    )

    if (!flatCheck.rows.length) {
      throw new Error("Flat not found")
    }

    const flat = flatCheck.rows[0]

    if (flat.resident_id) {
      throw new Error("Flat already has resident")
    }

    const residentCheck = await client.query(
      `
      SELECT *
      FROM users
      WHERE user_id = $1
      `,
      [residentId]
    )

    if (!residentCheck.rows.length) {
      throw new Error("Resident not found")
    }

    await client.query(
      `
      UPDATE flats
      SET resident_id = $1
      WHERE flat_id = $2
      `,
      [residentId, flatId]
    )

    const sub = await client.query(
      `
      SELECT monthly_rate
      FROM subscription_plans
      WHERE admin_id = $1
      AND flat_type = $2
      ORDER BY effective_from DESC
      LIMIT 1
      `,
      [flat.admin_id, flat.flat_type]
    )

    const rate = sub.rows[0]?.monthly_rate || 0

    const existingRecord = await client.query(
      `
      SELECT *
      FROM monthly_records
      WHERE flat_id = $1
      AND billing_month = date_trunc('month', CURRENT_DATE)
      `,
      [flatId]
    )

    if (!existingRecord.rows.length) {
      await client.query(
        `
        INSERT INTO monthly_records
        (
          record_id,
          flat_id,
          billing_month,
          amount,
          status
        )
        VALUES ($1,$2,date_trunc('month', CURRENT_DATE),$3,'PENDING')
        `,
        [
          uuidv4(),
          flatId,
          rate
        ]
      )
    }

    await client.query("COMMIT")

    return {
      success: true
    }

  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

// REGISTER RESIDENT
const registerResident = async (flat_id, data) => {
  const { full_name, email, phone_number } = data

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const existing = await client.query(
      `SELECT user_id FROM users WHERE email = $1`,
      [email]
    )

    if (existing.rows.length > 0) {
      throw new Error("Email already registered")
    }

    const resident_id = uuidv4()
    const hashedPassword = await bcrypt.hash("Society@123", 10)

    await client.query(
      `
      INSERT INTO users
      (
        user_id,
        email,
        password_hash,
        full_name,
        phone_number,
        role
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        resident_id,
        email,
        hashedPassword,
        full_name,
        phone_number,
        "RESIDENT"
      ]
    )

    const flatRes = await client.query(
      `
      UPDATE flats
      SET resident_id = $1
      WHERE flat_id = $2
      RETURNING flat_type
      `,
      [resident_id, flat_id]
    )

    const flatType = flatRes.rows[0].flat_type

    const sub = await client.query(
      `
      SELECT monthly_rate
      FROM subscription_plans
      WHERE flat_type = $1
      LIMIT 1
      `,
      [flatType]
    )

    const rate = sub.rows[0]?.monthly_rate || 0

    await client.query(
      `
      INSERT INTO monthly_records
      (
        record_id,
        flat_id,
        resident_id,
        month,
        amount_due,
        payment_status
      )
      VALUES ($1,$2,$3,date_trunc('month', CURRENT_DATE),$4,'PENDING')
      `,
      [
        uuidv4(),
        flat_id,
        resident_id,
        rate
      ]
    )

    await client.query("COMMIT")

    return {
      message: "Resident registered and assigned"
    }

  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat,
  restoreFlat,
  getAvailableResidents,
  assignResident,
  registerResident
}