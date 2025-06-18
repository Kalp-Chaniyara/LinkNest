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
import connectDB from "./lib/db.js";
import MongoStore from "connect-mongo";
// import mo

dotenv.config();
connectDB();

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
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};
app.use(cors(corsConfig));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl:7*24*60*60,
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Changed from 'none' to 'lax' for local development
        maxAge: 7*24*60*30*1000, // 7 days
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/link", linkRoutes);

// Initialize reminders for all active links
initializeReminders().catch(error => {
    console.error('Failed to initialize reminders:', error);
});

// Server
app.listen(process.env.PORT, () => {
     console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/",(_,res)=>{
     res.send("Hello World!");
})

export default app