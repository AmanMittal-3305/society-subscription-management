const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool =  require("./db")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const auth0_id = profile.id;

        // check existing user
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        // create new user
        const newUser = await pool.query(
          `INSERT INTO users 
          (email, full_name, auth0_id, role)
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
          [email, fullName, auth0_id, "RESIDENT"]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;