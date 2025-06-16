import generateAccesstoken from "../lib/token.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { generateOTP, verifyOTP } from '../utils/otp.js';
import { sendOTPEmail } from '../services/email.service.js';
import OTP from '../model/otp.model.js';
import crypto from 'crypto';

export const signup = async (req, res) => {
     try {
          const { fullName, email, password } = req.body;

          // Validate required fields
          if (!fullName || !email || !password) {
               return res.status(400).json({
                    success: false,
                    message: "All fields are required"
               });
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
               });
          }

          // Validate password strength
          if (password.length < 6) {
               return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long"
               });
          }

          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({
                    success: false,
                    message: "User already exists with this email"
               });
          }

          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Create new user
          const user = await User.create({
               fullName,
               email,
               password: hashedPassword,
               isEmailVerified: false
          });

          // Generate OTP
          const otp = generateOTP();
          user.otpSecret = otp;
          user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

          //save the user
          await user.save();
          
          // Send OTP email
          await sendOTPEmail(email, otp);

          // const token = // erateAccesstoken(user._id);
          // co// le.log("User ID",user._id);
          // console.log("Now // uesting for token",token)

          // res.// kie("tokenStorer", token, {
   //     //      httpOnly: true,
     //   //      // secure: false,
       // //      // sameSite: 'Lax',
          //      maxAge: 7 *//  * 60 * 60 * 1000//  7 days
          // });

          // console.log("DONE TOKEN");


          res.status(201).json({
               success: true,
               message: "User created successfully. Please verify your email with the OTP sent.",
               data: {
                    userId: user._id,
                    email: user.email
               }
          });
     } catch (error) {
          console.error("Signup error:", error);
          res.status(500).json({
               success: false,
               message: "Error in signup",
               error: error.message
          });
     }
};

export const verifyEmail = async (req, res) => {
     try {
          const { userId, otp } = req.body;
          console.log("Server: Received verification request for User ID:", userId, "with OTP:", otp);

          const user = await User.findById(userId);
          if (!user) {
               console.log("Server: User not found for ID:", userId);
               return res.status(404).json({
                    success: false,
                    message: "User not found"
               });
          }

          // Get token from cookies
          const token = req.cookies.tokenStorer;
          let authMethod = 'local'; // Default to local

          if (token) {
               try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    authMethod = decoded.authMethod || 'local';
                    console.log("Auth method from token:", authMethod);
               } catch (error) {
                    console.log("Error decoding token:", error);
               }
          }

          if (authMethod === 'google') {
               // Generate JWT token
               const token = generateAccesstoken(user._id, 'google');

               // Set token in HTTP-only cookie
               res.cookie("tokenStorer", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
               });

               return res.status(200).json({
                    success: true,
                    message: "Email verified successfully",
                    user: {
                         id: user._id,
                         name: user.name,
                         email: user.email,
                         isVerified: true
                    }
               });
          }

          if (!user.otpSecret || !user.otpExpiry) {
               return res.status(400).json({
                    success: false,
                    message: "No OTP request found"
               });
          }

          if (Date.now() > user.otpExpiry) {
               return res.status(400).json({
                    success: false,
                    message: "OTP has expired"
               });
          }

          console.log("Server: OTP Secret from DB:", user.otpSecret);
          console.log("Server: OTP received from client:", otp);

          const isValid = verifyOTP(user.otpSecret, otp, user.otpExpiry);
          if (!isValid) {
               console.log("Server: OTP verification failed.");
               return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
               });
          }

          console.log("Server: OTP verification successful!");

          user.isEmailVerified = true;
          user.otpSecret = undefined;
          user.otpExpiry = undefined;
          await user.save();

          // Generate and set token after successful verification
          const newToken = generateAccesstoken(user._id, 'local');
          console.log("User ID", user._id);
          console.log("Now requesting for token", newToken);

          // Set token in HTTP-only cookie
          res.cookie("tokenStorer", newToken, {
               httpOnly: true,
               secure: false,
               sameSite: 'Lax',
               maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          res.status(200).json({
               success: true,
               message: "Email verified successfully",
               user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: true
               }
          });
     } catch (error) {
          console.error("Email verification error:", error);
          res.status(500).json({
               success: false,
               message: "Error in email verification",
               error: error.message
          });
     }
};

export const resendOTP = async (req, res) => {
     try {
          const { userId } = req.body;

          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({
                    success: false,
                    message: "User not found"
               });
          }

          if (user.isEmailVerified) {
               return res.status(400).json({
                    success: false,
                    message: "Email already verified"
               });
          }

          // Generate new OTP
          const otp = generateOTP();
          user.otpSecret = otp;
          user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
          await user.save();

          // Send new OTP email
          await sendOTPEmail(user.email, otp);

          res.status(200).json({
               success: true,
               message: "New OTP sent successfully"
          });
     } catch (error) {
          console.error("Resend OTP error:", error);
          res.status(500).json({
               success: false,
               message: "Error in resending OTP",
               error: error.message
          });
     }
};

export const login = async (req, res) => {
     const { email, password } = req.body;
     console.log("Login attempt for email:", email); // Debug log

     try {
          if (!email || !password) {
               console.log("Missing email or password"); // Debug log
               return res.status(400).json({
                    success: false,
                    title: "Error",
                    message: "All fields are required",
                    type: "error"
               });
          }

          const user = await User.findOne({ email });
          console.log("User found:", user ? "Yes" : "No"); // Debug log

          if (!user) {
               console.log("No user found with email:", email); // Debug log
               return res.status(404).json({
                    success: false,
                    title: "Error",
                    message: "Invalid Credentials",
                    type: "error"
               });
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          console.log("Password correct:", isPasswordCorrect); // Debug log

          if (!isPasswordCorrect) {
               console.log("Invalid password for user:", email); // Debug log
               return res.status(400).json({
                    success: false,
                    title: "Error",
                    message: "Invalid Credentials",
                    type: "error"
               });
          }

          // Get existing token from cookies to check auth method
          const existingToken = req.cookies.tokenStorer;
          let authMethod = 'local'; // Default to local

          if (existingToken) {
               try {
                    const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
                    authMethod = decoded.authMethod || 'local';
                    console.log("Auth method from existing token:", authMethod);
               } catch (error) {
                    console.log("Error decoding existing token:", error);
               }
          }

          // Generate new token with the auth method
          const token = generateAccesstoken(user._id, authMethod);
          console.log("Token generated successfully with auth method:", authMethod); // Debug log

          res.cookie("tokenStorer", token, {
               httpOnly: true,
               secure: false,
               sameSite: 'Lax',
               maxAge: 7 * 24 * 60 * 60 * 1000
          });

          return res.status(200).json({
               success: true,
               title: "Success",
               message: "User logged in successfully",
               type: "success",
               data: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
               }
          });
     } catch (error) {
          console.error("Error in login controller:", error); // Enhanced error logging
          res.status(500).json({
               success: false,
               title: "Error in login",
               message: "Internal Server Error",
               type: "error"
          });
     }
};

export const logout = async (_, res) => {
     try {
          res.cookie("tokenStorer", "", {
               maxAge: 0
          });

          return res.status(200).json({ message: "User logged out successfully" });
     } catch (error) {
          console.log("Error in logout controller: ", error.message);
          res.status(500).json({ message: "Internal Server Error" });
     }
}

export const checkAuth = async (req, res) => {
     try {
          console.log("CHECK USER", req.user);
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

export const forgotPassword = async (req, res) => {
     try {
          const { email } = req.body;

          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(404).json({
                    success: false,
                    message: "No user found with this email"
               });
          }

          // Generate reset token
          const resetToken = crypto.randomBytes(32).toString('hex');
          const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          // Save reset token to user
          user.resetToken = resetToken;
          user.resetTokenExpiry = resetTokenExpiry;
          await user.save();

          // Send reset email
          await sendResetPasswordEmail(email, resetToken);

          res.status(200).json({
               success: true,
               message: "Password reset instructions sent to your email"
          });
     } catch (error) {
          console.error("Error in forgotPassword:", error);
          res.status(500).json({
               success: false,
               message: "Error processing password reset request"
          });
     }
};

export const resetPassword = async (req, res) => {
     try {
          const { token, newPassword } = req.body;

          // Find user by reset token
          const user = await User.findOne({
               resetToken: token,
               resetTokenExpiry: { $gt: Date.now() }
          });

          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid or expired reset token"
               });
          }

          // Hash new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);

          // Update user's password and clear reset token
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiry = undefined;
          await user.save();

          res.status(200).json({
               success: true,
               message: "Password has been reset successfully"
          });
     } catch (error) {
          console.error("Error in resetPassword:", error);
          res.status(500).json({
               success: false,
               message: "Error resetting password"
          });
     }
};