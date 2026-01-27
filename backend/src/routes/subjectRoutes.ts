import { Router } from 'express';
import { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject } from '../controllers/subjectController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createSubjectSchema, getSubjectsSchema, getSubjectByIdSchema, updateSubjectSchema, deleteSubjectSchema } from '../schemas/subjectSchemas';

const router = Router();

// Protect all routes
router.use(authenticate);

// POST /api/subjects
router.post('/', validate(createSubjectSchema), createSubject);

// GET /api/subjects (List)
router.get('/', validate(getSubjectsSchema), getSubjects);

// GET /api/subjects/:id (Detail)
router.get('/:id', validate(getSubjectByIdSchema), getSubjectById);

// PATCH /api/subjects/:id (Update)
router.patch('/:id', validate(updateSubjectSchema), updateSubject);

// DELETE /api/subjects/:id (Delete)
router.delete('/:id', validate(deleteSubjectSchema), deleteSubject);

export default router;
