import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

export const sendOTPEmail = async (email, otp) => {
    try {
        console.log('Attempting to send email with config:', {
            from: process.env.EMAIL_USER,
            to: email,
            hasPassword: !!process.env.EMAIL_PASS
        });

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email configuration is missing. Please check your environment variables.');
        }

        const mailOptions = {
            from: {
                name: 'Linkable',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Verify Your Email - Linkable',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Linkable!</h2>
                    <p>Thank you for signing up. To verify your email address, please use the following OTP:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        console.log('Sending email:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            to: info.envelope.to,
            from: info.envelope.from
        });
        return true;
    } catch (error) {
        console.error('Detailed error sending OTP email:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
        throw new Error('Failed to send OTP email');
    }
}; 