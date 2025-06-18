import User from "../model/user.model.js";
import { GOOGLE_CONFIG } from '../config/auth.config.js';
import { google } from "googleapis";

export const logout = async (req, res) => {
     try {
          // res.cookie("tokenStorer", "", {
          //      httpOnly: true,
          //      secure: process.env.NODE_ENV === "production",
          //      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          //      maxAge: 0,
          //    });
             
          res.cookie("tokenStorer", "", {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production" ? true : false,
               sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
               expires: new Date(0), // Expire immediately
               maxAge: 0,
             });
          //    console.log("Cookie",res.cookie);
          res.status(200).json({ success: true, message: 'Logged out' });
     } catch (error) {
          console.log("Error in logout controller: ", error.message);
          res.status(500).json({ message: "Internal Server Error" });
     }
}

export const checkAuth = async (req, res) => {
     try {
          // console.log("CHECK USER", req.user.resetToken," ",req.user.resetTokenExpiry);
          res.status(200).json({
               success: true,
               data: {
                    _id: req.user._id,
                    fullName: req.user.fullName,
                    email: req.user.email,
                    isEmailVerified: req.user.isEmailVerified,
               }
          });
     } catch (error) {
          console.log("Error in checkAuth controller: ", error.message);
          res.status(500).json({
               success: false,
               message: "Internal Server Error"
          });
     }
};

export const refreshGoogleToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log("User in refreshGoogleToken 5",user);
        if (!user || !user.googleId) {
            return res.status(400).json({
                success: false,
                message: "User not connected to Google"
            });
        }

        console.log("[Refresh Google Token] GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
        console.log("[Refresh Google Token] GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
        console.log("[Refresh Google Token] GOOGLE_CONFIG.scope:", GOOGLE_CONFIG.scope);

     //    Redirect to Google OAuth to get a new token
        const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);

        oauth2Client.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken,
        });

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [/* your scopes */],
        });

        console.log(`[Refresh Google Token] Generated Auth URL: ${url}`);

        try {
            // Try to use the access token
            // If it fails, catch the error and refresh
        } catch (err) {
            if (err.message.includes('invalid_token')) {
                // Refresh the token
                const { credentials } = await oauth2Client.refreshAccessToken();
                // Save new credentials to DB
                user.accessToken = credentials.access_token;
                // Retry the operation
            }
        }

        res.status(200).json({
            success: true,
            authUrl: url
        });
    } catch (error) {
        console.error("Error refreshing Google token:", error);
        res.status(500).json({
            success: false,
            message: "Error refreshing Google token"
        });
    }
};