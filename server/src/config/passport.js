import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CONFIG } from './auth.config.js';
import User from '../model/user.model.js';
import { generateOTP } from '../utils/otp.js';
import { sendOTPEmail } from '../services/email.service.js';

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

passport.use(new GoogleStrategy({
     clientID: GOOGLE_CONFIG.clientID,
     clientSecret: GOOGLE_CONFIG.clientSecret,
     callbackURL: GOOGLE_CONFIG.callbackURL,
     scope: GOOGLE_CONFIG.scope
}, async (accessToken, refreshToken, profile, done) => {
     try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
               // Update tokens for existing user
               user.googleAccessToken = accessToken;
               user.googleRefreshToken = refreshToken;
               user.tokenExpiryDate = new Date(Date.now() + 3*60 * 1000); // 1 hour expiry
               // console.log("USER 1",user);
               await user.save();
               return done(null, user, { accessToken, refreshToken });
          }

          // Check if user exists with same email but different auth method
          user = await User.findOne({ email: profile.emails[0].value });
          // console.log("USER 2",user);
          
          if (user) {
               // Link Google account to existing user
               user.googleId = profile.id;
               user.googleAccessToken = accessToken;
               user.googleRefreshToken = refreshToken;
               user.tokenExpiryDate = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
               await user.save();
               // console.log("USER 3",user);
               return done(null, user, { accessToken, refreshToken });
          }

          // Create new user
          user = await User.create({
               fullName: profile.displayName,
               email: profile.emails[0].value,
               googleId: profile.id,
               googleAccessToken: accessToken,
               googleRefreshToken: refreshToken,
               tokenExpiryDate: new Date(Date.now() + 3*60 * 1000), // 1 hour expiry
               isEmailVerified: true, // Automatically verify email for Google sign-ups
               authMethod: 'google' // Set authentication method to google
          });
          // console.log("USER 4",user);
          return done(null, user, { accessToken, refreshToken });
     } catch (error) {
          return done(error, null);
     }
}));

export default passport; 