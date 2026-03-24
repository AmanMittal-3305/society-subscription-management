const express = require("express")
const router = express.Router()
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authController = require("../controllers/authController")

router.post("/register", authController.register)
router.post("/login", authController.login)

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        user_id: req.user.user_id,
        email: req.user.email,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  }
);


module.exports = router