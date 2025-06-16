import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateAccesstoken = (userId,authMethod='local') => {
    return jwt.sign(
        {
            userId,
            authMethod,
        },
        process.env.SESSION_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key');
    } catch (error) {
        throw new Error('Invalid token');
    }
}; 