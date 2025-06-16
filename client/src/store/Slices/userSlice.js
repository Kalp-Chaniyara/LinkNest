import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast"

// const import.meta.env.VITE_REACT_APP_BACKEND_BASEURL = "http://localhost:3000/api/auth";

// Async thunks
export const signup = createAsyncThunk(
     "user/signup",
     async ({ fullName, email, password }, { rejectWithValue }) => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/signup`, {
                    fullName,
                    email,
                    password,
               },
               { withCredentials: true }
          );
               return response.data;
          } catch (error) {
               console.error("Signup error details:", error.response?.data);
               return rejectWithValue(error.response?.data || { message: "Failed to sign up" });
          }
     }
);

export const verifyEmail = createAsyncThunk(
     "user/verifyEmail",
     async ({ userId, otp }, { rejectWithValue }) => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/verify-email`, {
                    userId,
                    otp,
               },
               { withCredentials: true }
          );
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const resendOTP = createAsyncThunk(
     "user/resendOTP",
     async (userId, { rejectWithValue }) => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/resend-otp`, {
                    userId,
               },
               { withCredentials: true }
          );
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const login = createAsyncThunk(
     "user/login",
     async ({ email, password }, { rejectWithValue }) => {
          try {
               const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/login`,
                    {
                         email,
                         password,
                    },
                    { withCredentials: true }
               );
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const logout = createAsyncThunk(
     "user/logout",
     async (_, { rejectWithValue }) => {
          try {
               const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/logout`,
                    {},
                    { withCredentials: true }
               );
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const checkAuth = createAsyncThunk(
     "user/checkAuth",
     async (_, { rejectWithValue }) => {
          try {
               // console.log('Checking auth status...');
               const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/check`, {
                    withCredentials: true,
               });
               // console.log('Auth check response:', response.data);
               return response.data;
          } catch (error) {
               // console.error('Auth check error:', error);
               return rejectWithValue(error.response?.data || { message: 'Authentication failed' });
          }
     }
);

const initialState = {
     user: null,
     loading: false,
     error: null,
     isLogin: false,
     showVerificationModal: false,
     verificationStatus: {
          isVerifying: false,
          isVerified: false,
          error: null,
     },
};

const userSlice = createSlice({
     name: "user",
     initialState,
     reducers: {
          clearError: (state) => {
               state.error = null;
               state.verificationStatus.error = null;
          },
          setUser: (state, action) => {
               state.user = action.payload;
               state.isLogin = true;
               state.loading = false;
               state.error = null;
          }
     },
     extraReducers: (builder) => {
          builder
               // Signup
               .addCase(signup.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(signup.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload.data;
                    if (action.payload.data.authMethod === 'google' && action.payload.data.isEmailVerified) {
                         state.isLogin = true;
                         state.showVerificationModal = false;
                    } else {
                         state.user.isEmailVerified = false;
                         state.showVerificationModal = true;
                    }
                    // console.log("IT should show now")
               })
               .addCase(signup.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               // Verify Email
               .addCase(verifyEmail.pending, (state) => {
                    state.verificationStatus.isVerifying = true;
                    state.verificationStatus.error = null;
               })
               .addCase(verifyEmail.fulfilled, (state) => {
                    state.verificationStatus.isVerifying = false;
                    state.verificationStatus.isVerified = true;
                    state.isLogin=true;
                    state.user.isEmailVerified = true;
                    state.showVerificationModal = false;
               })
               .addCase(verifyEmail.rejected, (state, action) => {
                    state.isLogin=false;
                    state.verificationStatus.isVerifying = false;
                    state.verificationStatus.error = action.payload;
               })
               // Resend OTP
               .addCase(resendOTP.pending, (state) => {
                    state.verificationStatus.isVerifying = true;
                    state.verificationStatus.error = null;
               })
               .addCase(resendOTP.fulfilled, (state) => {
                    state.verificationStatus.isVerifying = false;
               })
               .addCase(resendOTP.rejected, (state, action) => {
                    state.verificationStatus.isVerifying = false;
                    state.verificationStatus.error = action.payload;
               })
               // Login
               .addCase(login.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(login.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload.data;
                    state.isLogin = true;
               })
               .addCase(login.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.isLogin = false;
               })
               // Logout
               .addCase(logout.fulfilled, (state) => {
                    state.user = null;
                    state.isLogin = false;
                    state.verificationStatus = {
                         isVerifying: false,
                         isVerified: false,
                         error: null,
                    };
               })
               // Check Auth
               .addCase(checkAuth.pending, (state) => {
                    // console.log('Auth check pending');
                    state.loading = true;
                    state.error = null;
               })
               .addCase(checkAuth.fulfilled, (state, action) => {
                    // console.log('Auth check fulfilled:', action.payload);
                    state.loading = false;
                    state.user = action.payload.data;
                    state.isLogin = true;
                    state.error = null;
               })
               .addCase(checkAuth.rejected, (state, action) => {
                    // console.log('Auth check rejected:', action.payload);
                    state.loading = false;
                    state.user = null;
                    state.isLogin = false;
                    state.error = action.payload;
               });
     },
});

export const { clearError, setUser } = userSlice.actions;
export { userSlice };
export default userSlice.reducer;