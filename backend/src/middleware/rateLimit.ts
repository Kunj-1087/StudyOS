import rateLimit from 'express-rate-limit';
import Logger from '../utils/logger';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: 'Too many login attempts, please try again after 15 minutes',
    },
    handler: (req, res, next, options) => {
        Logger.warn(`Rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests, please try again later',
    },
});
