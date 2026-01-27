import { hashPassword, verifyPassword, generateTokens, verifyAccessToken } from '../../src/utils/auth';
import jwt from 'jsonwebtoken';

describe('Auth Utils Unit Tests', () => {

    describe('hashing', () => {
        it('should hash a password correctly', async () => {
            const password = 'mySecretPassword';
            const hash = await hashPassword(password);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
        });

        it('should verify a correct password', async () => {
            const password = 'password123';
            const hash = await hashPassword(password);
            const isValid = await verifyPassword(password, hash);

            expect(isValid).toBe(true);
        });

        it('should reject a wrong password', async () => {
            const password = 'password123';
            const hash = await hashPassword(password);
            const isValid = await verifyPassword('wrongpassword', hash);

            expect(isValid).toBe(false);
        });
    });

    describe('tokens', () => {
        it('should generate valid access and refresh tokens', () => {
            const userId = 'user-123';
            const { accessToken, refreshToken } = generateTokens(userId);

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();

            const decoded = verifyAccessToken(accessToken);
            expect(decoded.userId).toBe(userId);
        });
    });
});
