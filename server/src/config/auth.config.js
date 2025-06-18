import dotenv from 'dotenv';
dotenv.config();

// export const OTP_CONFIG = {
//     length: 6,        // Length of the OTP
//     step: 30,         // Time step in seconds
//     window: 1,        // Number of time steps to check before and after
//     issuer: 'Linkable' // Name of the service
// };

export const GOOGLE_CONFIG = {
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
    scope: [
        'profile', 
        'email', 
        'https://www.googleapis.com/auth/calendar'
    ]
}; 