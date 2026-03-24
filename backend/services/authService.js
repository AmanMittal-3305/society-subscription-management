const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

const register = async ({ email, password, full_name, phone_number, role }) => {

  const existingUser = await pool.query(
    `SELECT user_id FROM users WHERE email=$1`,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, phone_number, role)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING user_id, email, full_name, role`,
    [email, hashedPassword, full_name, phone_number, role]
  );

  return result.rows[0];
};

const login = async ({ email, password, role }) => {

  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  )

  if(result.rows.length === 0) return null

  const user = result.rows[0]

  let validPassword = false

  if(user.password_hash === password){
    validPassword = true
  }else{
    validPassword = await bcrypt.compare(password, user.password_hash)
  }

  if(!validPassword) return null

  if(user.role !== role) return null

  const token = jwt.sign(
    {
      user_id:user.user_id,
      email:user.email,
      role:user.role
    },
    JWT_SECRET,
    {
      expiresIn:"7d"
    }
  )

  return {
    user_id:user.user_id,
    email:user.email,
    full_name:user.full_name,
    role:user.role,
    token
  }
}

module.exports = { register, login };