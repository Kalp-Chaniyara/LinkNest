import express from 'express';
import passport from 'passport';
import { signup, login, verifyEmail, resendOTP } from '../controllers/user.controller.js';
import { logout } from "../controllers/user.controller.js";
import { checkAuth } from "../controllers/user.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";
import { generateAccesstoken } from '../utils/jwt.utils.js';

const router = express.Router();

// Local authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

// Google OAuth routes
router.get('/google',
     passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
     passport.authenticate('google', { failureRedirect: '/login' }),
     async (req, res) => {
          try {
               // Generate JWT token
               const token = generateAccesstoken(req.user._id,'google');
               
               // Set token in cookie
               res.cookie('tokenStorer', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
               });

               // Redirect to client with success
               res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
          } catch (error) {
               console.error('Google callback error:', error);
               res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
          }
     }
);

router.post("/logout", logout);
router.get("/check", validateToken, checkAuth);

export default router;