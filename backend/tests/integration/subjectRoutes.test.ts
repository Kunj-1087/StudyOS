import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/db/client';
import { generateTokens } from '../../src/utils/auth';

// Mock Prisma Client
jest.mock('../../src/db/client', () => ({
    __esModule: true,
    default: {
        subject: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
        },
        $transaction: jest.fn((args) => args), // simple mock for transaction passing results
    }
}));

// Mock Auth Middleware to verify tokens without real DB users
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { userId: 'mock-user-id' }; // Force auth
        next();
    },
}));

describe('Subject Routes Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/subjects', () => {
        it('should create a new subject', async () => {
            const newSubject = { name: 'Mathematics', color: '#FF0000' };
            const createdSubject = { id: 'subj-1', ...newSubject, userId: 'mock-user-id' };

            (prisma.subject.create as jest.Mock).mockResolvedValue(createdSubject);

            const res = await request(app)
                .post('/api/subjects')
                .send(newSubject);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdSubject);
            expect(prisma.subject.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    name: newSubject.name,
                    color: newSubject.color
                })
            }));
        });

        it('should fail if name is missing', async () => {
            const res = await request(app)
                .post('/api/subjects')
                .send({ color: '#FF0000' });

            expect(res.status).toBe(400); // Validation error
        });
    });

    describe('GET /api/subjects', () => {
        it('should return a list of subjects', async () => {
            const subjects = [{ id: '1', name: 'Math', userId: 'mock-user-id' }];
            const count = 1;

            // transaction returns [data, count]
            (prisma.$transaction as jest.Mock).mockResolvedValue([subjects, count]);

            const res = await request(app).get('/api/subjects');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.meta.total).toBe(1);
        });
    });
});
