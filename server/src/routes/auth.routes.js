import express from 'express';
import passport from 'passport';
// import { signup, login, verifyEmail, resendOTP } from '../controllers/user.controller.js';
import { logout } from "../controllers/user.controller.js";
import { checkAuth } from "../controllers/user.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";
import { generateAccesstoken } from '../utils/jwt.utils.js';
import { refreshGoogleToken } from '../controllers/user.controller.js';
// import { addSubscription, removeSubscription } from '../services/push.service.js';

const router = express.Router();

// Local authentication routes
// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/verify-email', verifyEmail);
// router.post('/resend-otp', resendOTP);

// Google OAuth routes
router.get(
     '/google',
     passport.authenticate('google', {
       scope: ['profile', 'email',
               'https://www.googleapis.com/auth/calendar'], 
       accessType: 'offline',      // get a refresh_token
       prompt: 'consent',          // force new consent (for refresh_token & new scopes)
     })
);

router.get('/google/callback',
     passport.authenticate('google', { failureRedirect: '/signup', accessType: 'offline',
          prompt: 'consent' }),
     async (req, res) => {
          try {
               // Set authMethod to google for all Google authenticated users
               if (req.user) {
                    req.user.authMethod = 'google';
               }

               // Store the access token in the user document
               if (req.user && req.authInfo && req.authInfo.accessToken) {
                    // req.user.googleAccessToken = req.authInfo.accessToken;
                    req.user.googleAccessToken  = req.authInfo.accessToken;
                    req.user.googleRefreshToken = req.authInfo.refreshToken;
               }
               
               // console.log(`[Google Callback] User authMethod before save: ${req.user}`);

               // console.log("User in google callback 6",req.user);
               await req.user.save();

               // Generate JWT token
               const token = generateAccesstoken(req.user._id);
               
               // Set token in cookie
               res.cookie('tokenStorer', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Changed from 'none' to 'lax' for local development
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    path: '/'
                });

               // Redirect to client with success
               res.redirect(`${process.env.CLIENT_URL}/dashboard`);
          } catch (error) {
               console.error('Google callback error:', error);
               res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
          }
     }
);

router.post("/logout", logout);
router.get("/check", validateToken, checkAuth);
router.get("/refresh-google-token", validateToken, refreshGoogleToken);

export default router;