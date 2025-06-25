import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Debug logging
// console.log('Email Configuration:', {
//     host: 'smtp.gmail.com',
//     port: process.env.NODE_ENV === 'production' ? 465 : process.env.EMAIL_PORT,
//     hasUser: !!process.env.EMAIL_USER,
//     hasPass: !!process.env.EMAIL_PASS,
//     secure: process.env.NODE_ENV === 'production'
// });

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.NODE_ENV === 'production' ? 465 : parseInt(process.env.EMAIL_PORT) || 465,
    secure: process.env.NODE_ENV === 'production', // true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Verify transporter configuration with detailed error logging
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
        });
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

// export const sendOTPEmail = async (email, otp) => {
//     try {
//         // console.log('Attempting to send email with config:', {
//         //     from: process.env.EMAIL_USER,
//         //     to: email,
//         //     hasPassword: !!process.env.EMAIL_PASS
//         // });

//         if (!`${process.env.EMAIL_USER}` || !`${process.env.EMAIL_PASS}`) {
//             throw new Error('Email configuration is missing. Please check your environment variables.');
//         }

//         const mailOptions = {
//             from: {
//                 name: 'Linkable',
//                 address: `${process.env.EMAIL_USER}`
//             },
//             to: email,
//             subject: 'Verify Your Email - Linkable',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">Welcome to Linkable!</h2>
//                     <p>Thank you for signing up. To verify your email address, please use the following OTP:</p>
//                     <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
//                         <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
//                     </div>
//                     <p>This OTP will expire in 5 minutes.</p>
//                     <p>If you didn't request this verification, please ignore this email.</p>
//                     <hr style="border: 1px solid #eee; margin: 20px 0;">
//                     <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
//                 </div>
//             `
//         };

//         // console.log('Sending email:', {
//         //     from: mailOptions.from,
//         //     to: mailOptions.to,
//         //     subject: mailOptions.subject
//         // });

//         const info = await transporter.sendMail(mailOptions);
//         // console.log('Email sent successfully:', {
//         //     messageId: info.messageId,
//         //     to: info.envelope.to,
//         //     from: info.envelope.from
//         // });
//         return true;
//     } catch (error) {
//         console.error('Detailed error sending OTP email:', {
//             message: error.message,
//             stack: error.stack,
//             code: error.code,
//             command: error.command
//         });
//         throw new Error('Failed to send OTP email');
//     }
// };

//new part below

export const sendReminderEmail = async (email, link) => {
    try {
        if (!`${process.env.EMAIL_USER}` || !`${process.env.EMAIL_PASS}`) {
            throw new Error('Email configuration is missing. Please check your environment variables.');
        }

        const mailOptions = {
            from: {
                name: 'Linkable',
                address: `${process.env.EMAIL_USER}`
            },
            to: email,
            subject: `Reminder: ${link.title} - Linkable`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Reminder from Linkable</h2>
                    <p>This is a reminder for the following link:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #007bff; margin: 0;">${link.title}</h3>
                        ${link.reminderNote ? `<p style="margin: 10px 0;">${link.reminderNote}</p>` : ''}
                        <p style="margin: 10px 0;"><a href="${link.url}" style="color: #007bff; text-decoration: none;">Visit Link →</a></p>
                    </div>
                    <p>You can manage your reminders in your Linkable dashboard.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log('Reminder email sent successfully:', {
        //     messageId: info.messageId,
        //     to: info.envelope.to
        // });
        return true;
    } catch (error) {
        console.error('Error sending reminder email:', error);
        throw new Error('Failed to send reminder email');
    }
}; 