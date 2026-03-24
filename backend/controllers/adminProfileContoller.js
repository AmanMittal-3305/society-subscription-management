const pool = require("../config/db");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT user_id, email, full_name, phone_number, role
       FROM users
       WHERE user_id=$1`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const residentId = req.user.user_id; // from authMiddleware
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let query = `
      UPDATE users
      SET full_name = $1,
          email = $2,
          phone_number = $3
    `;
    const values = [name, email, phone];


    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password_hash = $4`;
      values.push(hashedPassword);
    }

    query += ` WHERE user_id = $${values.length + 1} RETURNING user_id, full_name, email, phone_number, role`;
    values.push(residentId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: result.rows[0] });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getProfile, updateProfile };