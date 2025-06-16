import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendOTP } from '../store/Slices/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmailVerification = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();

     const userSliceState = useSelector((state) => state.user);
     const { user, showVerificationModal } = userSliceState; // Destructure from the full state

     const [otp, setOtp] = useState('');

     useEffect(() => {
          // console.log("Modal visibility:", showVerificationModal);
          // console.log("User state from useEffect:", user);
     }, [showVerificationModal, user]);

     const handleVerify = async (e) => {
          e.preventDefault();
          if (!otp) {
               toast.error('Please enter the OTP');
               return;
          }

          const currentUserId = userSliceState.user?._id; // Access user ID directly from the current state

          if (!currentUserId) {
               toast.error('User ID is missing for verification. Please try signing up again.');
               console.error("User ID is undefined during verification attempt. Full user slice state:", userSliceState);
               return;
          }

          // console.log('Attempting to verify email...');
          // console.log('User ID being sent:', currentUserId);
          // console.log('OTP entered:', otp);

          try {
               const result = await dispatch(verifyEmail({
                    userId: currentUserId,
                    otp
               })).unwrap();

               if (result.success) {
                    toast.success('Email verified successfully!');
                    // console.log('Email verification successful!', result);
                    navigate('/dashboard');
               } else {
                    // console.log('Email verification failed with success: false', result);
                    toast.error(result.message || 'Failed to verify email');
               }
          } catch (error) {
               console.error('Error during email verification:', error);
               toast.error(error.message || 'Failed to verify email');
          }
     };

     const handleResendOtp = async () => {
          if (!user || !user._id) {
               toast.error('User data missing for OTP resend. Please try signing up again.');
               return;
          }
          try {
               const result = await dispatch(resendOTP(user._id)).unwrap();
               if (result.success) {
                    toast.success('New OTP sent to your email!');
               } else {
                    toast.error(result.message || 'Failed to resend OTP');
               }
          } catch (error) {
               console.error('Error during OTP resend:', error);
               toast.error(error.message || 'Failed to resend OTP');
          }
     };

     if (!showVerificationModal) {
          return null;
     }

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
                    <p className="text-gray-600 mb-4">
                         We've sent a verification code to {user?.email}. Please enter it below.
                    </p>
                    <form onSubmit={handleVerify} className="space-y-4">
                         <div>
                              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                   Verification Code
                              </label>
                              <input
                                   type="text"
                                   id="otp"
                                   value={otp}
                                   onChange={(e) => setOtp(e.target.value)}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                   placeholder="Enter 6-digit code"
                                   maxLength={6}
                              />
                         </div>
                         <Button
                              type="submit"
                              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                         >
                              Verify Account
                         </Button>
                    </form>
                    <p className="mt-4 text-sm text-center text-gray-500">
                         Didn't receive the code?{" "}
                         <Button variant="link" onClick={handleResendOtp} className="p-0 h-auto text-indigo-600 hover:text-indigo-500">
                              Resend OTP
                         </Button>
                    </p>
               </div>
          </div>
     );
};

export default EmailVerification; 