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
     scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
     try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
               return done(null, user);
          }

          // Check if user exists with same email but different auth method
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
               // Link Google account to existing user
               user.googleId = profile.id;
               // Don't automatically verify email
               await user.save();
               return done(null, user);
          }

          // Create new user
          user = await User.create({
               fullName: profile.displayName,
               email: profile.emails[0].value,
               googleId: profile.id,
               isEmailVerified: false // Don't automatically verify email
          });

          // Generate and send OTP for email verification
          const otp = generateOTP();
          user.otpSecret = otp.secret;
          user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
          await user.save();

          // Send OTP email
          await sendOTPEmail(user.email, otp.token);

          return done(null, user);
     } catch (error) {
          return done(error, null);
     }
}));

export default passport; 