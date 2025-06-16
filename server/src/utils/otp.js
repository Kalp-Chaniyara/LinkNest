import crypto from 'crypto';

// Generate a new OTP
export const generateOTP = () => {
    const digits = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number
    return otp;
};

// Verify an OTP
export const verifyOTP = (storedOtp, receivedOtp, otpExpiry) => {
    try {
        // Check if OTP has expired
        if (Date.now() > otpExpiry) {
            console.log("OTP has expired.");
            return false;
        }

        // Compare the stored OTP with the received OTP
        const isValid = storedOtp === receivedOtp;
        console.log("Stored OTP:", storedOtp);
        console.log("Received OTP:", receivedOtp);
        console.log("OTP is valid:", isValid);
        return isValid;
    } catch (error) {
        console.error("OTP verification error:", error);
        return false;
    }
}; 