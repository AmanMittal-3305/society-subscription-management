const authService = require("../services/authService");
const { db } = require("../config/firebase");

const register = async (req, res) => {
  try {

    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await authService.register(req.body);

await db.collection("users").doc(user.user_id).set({
  full_name: full_name,
  email: email,
  role: role,        
  fcmToken: "",      
});

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {

    if (error.message === "Email already registered") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }

    const user = await authService.login(req.body);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or role",
      });
    }

    res.json({
      success: true,
      ...user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

module.exports = { register, login };