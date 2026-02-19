import jwt from 'jsonwebtoken';

const generateAccessToken = (id,email,role) => {
    return jwt.sign({id,email,role}, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });
}

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export {generateAccessToken, generateRefreshToken};