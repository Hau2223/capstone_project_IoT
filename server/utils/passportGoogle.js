const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // <- Đã có
require('dotenv').config({
  path: './etc/secrets/config.env',
});

console.log('GOOGLE_CLIENT_ID',process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET',process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/user/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) return done(null, existingUser);

        // 👉 Băm mật khẩu giả lập để pass validate
        const hashedPassword = await bcrypt.hash('google_auth', 10);

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: hashedPassword,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
