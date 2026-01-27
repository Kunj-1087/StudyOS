import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

const IS_PROD = process.env.NODE_ENV === 'production';

if (IS_PROD && (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET)) {
    throw new Error('FATAL: JWT_SECRET and REFRESH_SECRET must be defined in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super_secret_refresh_key';

// Hashing
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

// Tokens
export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
};

// Cookie Setter
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
