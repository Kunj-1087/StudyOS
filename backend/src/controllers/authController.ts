import { Request, Response } from 'express';
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository';
import { hashPassword, verifyPassword, generateTokens, setAuthCookies } from '../utils/auth';
import prisma from '../db/client';
import Logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (await findUserByEmail(email)) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        // Transaction: Create User AND Default Subject atomically.
        // If creating the default subject fails, the user creation will roll back.
        const user = await prisma.$transaction(async (tx) => {
            // Step 1: Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            // Step 2: Create Default Subject
            await tx.subject.create({
                data: {
                    name: 'General',
                    color: '#808080', // Grey
                    userId: newUser.id,
                },
            });

            return newUser;
        });

        const { accessToken, refreshToken } = generateTokens(user.id);
        setAuthCookies(res, accessToken, refreshToken); // Corrected to use destructured variables

        res.status(201).json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user || !(await verifyPassword(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user.id);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

        res.status(200).json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ success: true, message: 'Logged out' });
};

// GET /me
export const me = async (req: Request, res: Response) => {
    try {
        // req.user is populated by authenticate middleware
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
