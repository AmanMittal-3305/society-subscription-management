const express = require("express");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const passport = require("./config/passport");
const bcrypt = require("bcrypt");

const pool = require("./config/db"); // PostgreSQL pool

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const residentRoutes = require("./routes/residentRoutes");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}))

app.use(express.json());


const dbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};


const adminSeeding = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const fullName = "Super Admin";

    const existingAdmin = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        `,
        [email, hashedPassword, fullName, "ADMIN"]
      );

      console.log("✅ Admin seeded successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Admin seeding failed:", error.message);
  }
};

const bootup = async () => {
  await dbConnection();
  await adminSeeding();
};

app.use("/api/admin", adminRoutes);
app.use("/api/resident", residentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Society API Running");
});

// error handler and middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await bootup();
  console.log(`🚀 Server running on port ${PORT}`);
});