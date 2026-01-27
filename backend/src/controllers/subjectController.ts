import { Request, Response } from 'express';
import { createSubject as createSubjectRepo, findSubjects, findSubjectById, updateSubject as updateSubjectRepo, deleteSubject as deleteSubjectRepo } from '../repositories/subjectRepository';
import Logger from '../utils/logger';

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, color } = req.body;
        // req.user is populated by authenticate middleware
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const subject = await createSubjectRepo({
            name,
            color,
            user: { connect: { id: userId } }
        });

        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to create subject' });
    }
};

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Typed by Zod middleware
        const { page, limit, search, sortBy, sortDir } = req.query as any;

        const skip = (page - 1) * limit;

        const { data, total } = await findSubjects({
            userId,
            skip,
            take: limit,
            search,
            sortBy,
            sortDir
        });

        res.json({
            success: true,
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch subjects' });
    }
};

export const getSubjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const subject = await findSubjectById(id, userId);

        if (!subject) {
            // findSubjectById filters by userId, so null means either not found OR not yours.
            // For security through obscurity, 404 is fine.
            return res.status(404).json({ success: false, error: 'Subject not found' });
        }

        res.json({ success: true, data: subject });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch subject' });
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, color, updatedAt } = req.body;
        const userId = (req as any).user?.userId;

        if (!userId) return res.status(401).json({ success: false });

        // 1. Fetch existing
        const subject = await findSubjectById(id, userId);
        if (!subject) return res.status(404).json({ success: false, error: 'Subject not found' });

        // 2. Concurrency Check (Optimistic Locking)
        if (updatedAt && new Date(updatedAt).getTime() !== new Date(subject.updatedAt).getTime()) {
            return res.status(409).json({
                success: false,
                error: 'Conflict: Data has been modified by another user.',
                currentData: subject
            });
        }

        // 3. Update
        // Pass userId implicitly via find check, but repo update just needs id as we verified ownership
        // To be strictly safe against race conditions where someone changes owner, we could use updateMany or check again.
        // For this app, previous check is sufficient.
        const updated = await updateSubjectRepo(id, { name, color });

        res.json({ success: true, data: updated });

    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to update subject' });
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

        // 1. Verify owner
        const existing = await findSubjectById(id, userId);
        if (!existing) return res.status(404).json({ success: false, error: 'Subject not found' });

        // 2. Delete
        await deleteSubjectRepo(id);

        res.json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to delete subject' });
    }
};
