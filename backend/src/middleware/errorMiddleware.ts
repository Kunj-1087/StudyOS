import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import Logger from '../utils/logger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // 1. AppError (Expected operational errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // 2. Prisma Errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate field value entered';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Resource not found';
        } else {
            message = `Database Error: ${err.code}`;
        }
    }

    // 3. Zod Errors (If they trickle down here, though usually handled in validation middleware)
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
    }

    // 4. Fallback for generic errors
    else if (err instanceof Error) {
        message = err.message;
    }

    // Log only 500 errors or unexpected ones as Error, others as Warn
    if (statusCode >= 500) {
        Logger.error(err);
    } else {
        Logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.ip}`);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        ...(err instanceof ZodError ? { details: err.errors } : {})
    });
};
