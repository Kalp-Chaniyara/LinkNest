import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import passport from './config/passport.js';
import session from 'express-session';
import { initializeReminders } from './services/reminder.service.js';

dotenv.config();

// Verify environment variables
// console.log('Environment variables loaded:', {
//     hasEmailUser: !!process.env.EMAIL_USER,
//     hasEmailPass: !!process.env.EMAIL_PASS,
//     emailUser: process.env.EMAIL_USER
// });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const corsConfig = {
     origin:`${process.env.CLIENT_URL}`,
     credentials:true,
 }
 app.use(cors(corsConfig))

// Session configuration
app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'lax', // allow sending cookies from frontend on same-site requests
          secure: false
     }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/link", linkRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log("Connected to MongoDB"))
     .catch((err) => console.error("MongoDB connection error:", err));

// Initialize reminders for all active links
initializeReminders().catch(error => {
    console.error('Failed to initialize reminders:', error);
});

// Server
app.listen(process.env.PORT, () => {
     console.log(`Server is running on port ${process.env.PORT}`);
});