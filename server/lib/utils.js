import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    // Generate a JWT token with the user ID as payload
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token will expire in 30 days
    });
}