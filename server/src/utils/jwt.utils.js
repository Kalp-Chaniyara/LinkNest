import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateAccesstoken = (userId) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.SESSION_SECRET,
        { expiresIn: '7d' }
    );
};

// export const verifyToken = (token) => {
//     try {
//         return jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key');
//     } catch (error) {
//         throw new Error('Invalid token');
//     }
// }; 