import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendOTP } from '../store/Slices/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { user, verificationStatus, showVerificationModal } = useSelector((state) => state.user);
     const [otp, setOtp] = useState('');

     useEffect(() => {
          console.log("Modal visibility:", showVerificationModal);
          console.log("User state:", user);
        }, [showVerificationModal, user]);

     const handleVerify = async (e) => {
          e.preventDefault();
          if (!otp) {
               toast.error('Please enter the OTP');
               return;
          }

          console.log('Attempting to verify email...');
          console.log('User ID:', user?._id);
          console.log('OTP entered:', otp);

          try {
               const result = await dispatch(verifyEmail({
                    userId: user._id,
                    otp
               })).unwrap();

               if (result.success) {
                    toast.success('Email verified successfully!');
                    console.log('Email verification successful!', result);
                    navigate('/dashboard'); // Redirect to dashboard on success
               } else {
                    console.log('Email verification failed with success: false', result);
               }
          } catch (error) {
               console.error('Error during email verification:', error);
               toast.error(error.message || 'Failed to verify email');
          }
     };

     const handleResendOTP = async () => {
          console.log('Attempting to resend OTP...');
          console.log('User ID for resend:', user?._id);
          try {
               const result = await dispatch(resendOTP(user._id)).unwrap();
               if (result.success) {
                    toast.success('New OTP sent successfully!');
                    console.log('Resend OTP successful!', result);
               } else {
                    console.log('Resend OTP failed with success: false', result);
               }
          } catch (error) {
               console.error('Error during resend OTP:', error);
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
                         <div className="flex flex-col space-y-2">
                              <button
                                   type="submit"
                                   className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                   disabled={verificationStatus.isVerifying}
                              >
                                   {verificationStatus.isVerifying ? 'Verifying...' : 'Verify Email'}
                              </button>
                              <button
                                   type="button"
                                   onClick={handleResendOTP}
                                   className="w-full text-indigo-600 hover:text-indigo-500 text-sm"
                                   disabled={verificationStatus.isVerifying}
                              >
                                   Resend Code
                              </button>
                         </div>
                    </form>
                    {verificationStatus.error && (
                         <p className="mt-2 text-sm text-red-600">
                              {verificationStatus.error.message}
                         </p>
                    )}
               </div>
          </div>
     );
};

export default EmailVerification; 