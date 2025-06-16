import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         // required: function() {
//         //     return this.authProvider === 'local';
//         // }
//     },
//     googleId: {
//         type: String,
//         sparse: true
//     },
//     isEmailVerified: {
//         type: Boolean,
//         default: false
//     },
//     otpSecret: {
//           type: String
//     },
//     otpExpiry: {
//           type: Date
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     lastLogin: {
//         type: Date,
//         default: Date.now
//     }
// }, { timestamps: true });

// // Create indexes for faster queries
// userSchema.index({ email: 1 });
// userSchema.index({ googleId: 1 });

// const User = mongoose.model('User', userSchema);

// export default User; 

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function() { return this.authMethod === 'local'; },
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        otpSecret: {
            type: String
        },
        otpExpiry: {
            type: Date
        },
        resetToken: {
            type: String,
            default: null
        },
        resetTokenExpiry: {
            type: Date,
            default: null
        },
        googleId: {
            type: String,
            sparse: true
        },
        googleAccessToken: {
            type: String
        },
        googleRefreshToken: {
            type: String
        },
        tokenExpiryDate: {
            type: Date
        },
        authMethod: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        otp: String,
        otpExpires: Date,
        pushSubscriptions: [Object],
    },
    { timestamps: true }
);

// userSchema.index({ email: 1 });
// userSchema.index({ googleId: 1 });

const User = mongoose.model('User', userSchema);

export default User; 