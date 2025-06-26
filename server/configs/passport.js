const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/mern/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let existingUser = await User.findOne({ googleId: profile.id });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with the same email
      let userByEmail = await User.findOne({ email: profile.emails[0].value });
      
      if (userByEmail) {
        // Link Google account to existing user
        userByEmail.googleId = profile.id;
        userByEmail.provider = 'google';
        userByEmail.profilePicture = profile.photos[0].value;
        userByEmail.isVerified = true;
        await userByEmail.save();
        return done(null, userByEmail);
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        provider: 'google',
        userType: 'User', // Set default user type
        isVerified: true
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      console.error('Error in Google Strategy:', error);
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;