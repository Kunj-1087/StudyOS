import { z } from 'zod';

export const createSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code'),
    }),
});

export const getSubjectsSchema = z.object({
    query: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('10'),
        search: z.string().optional(),
        sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
        sortDir: z.enum(['asc', 'desc']).default('desc'),
    }),
});

export const getSubjectByIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid Subject ID'),
    }),
});

export const updateSubjectSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid Subject ID'),
    }),
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        updatedAt: z.string().datetime().optional(),
    }),
});

export const deleteSubjectSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid Subject ID'),
    }),
});
