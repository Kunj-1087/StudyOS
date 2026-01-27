# Security Review & Checklist

## 1. Authentication & Session Management
*   [x] **JWT Strategy**: Using separate `access_token` (15m) and `refresh_token` (7d).
*   [x] **Cookie Security**:
    *   `httpOnly: true`: Prevents XSS theft.
    *   `sameSite: 'strict'`: Prevents CSRF attacks specific to cross-site requests.
    *   `secure`: Enabled in Production (`NODE_ENV=production`).
*   [ ] **Action**: Ensure your production load balancer terminates SSL correctly so `req.secure` (or `X-Forwarded-Proto`) works.

## 2. Input Validation
*   [x] **Zod Schemas**: Applied to all endpoints via `validate()` middleware.
*   [x] **Strict Typing**: TypeScript prevents internal type confusion.
*   [ ] **Action**: Ensure no `any` types linger in critical paths (Controllers looks clean).

## 3. Injection Prevention
*   [x] **SQL Injection**: Prisma ORM uses parameterized queries by default. Safe.
*   [x] **XSS**: Helmet sets `Content-Security-Policy` and `X-XSS-Protection`.
*   [x] **Command Injection**: No `exec/spawn` found in codebase.

## 4. Secrets Management
*   [x] **Environment Variables**: `dotenv` is configured.
*   [!] **Hardcoded Fallbacks**: `src/utils/auth.ts` has default secrets (`super_secret_dev_key`).
    *   **Risk**: If `.env` fails to load in Prod, it silently defaults to a known weak key.
    *   **Fix**: Throw error in Prod if secret is missing.
*   [ ] **Git Ignore**: Verify `.env` is listed in your `.gitignore` to prevent committing secrets.

## Quick Fixes Checklist

### 1. Hardening Secrets (Recommended)
Modify `src/utils/auth.ts`:
```typescript
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined in production');
}
```

### 2. Rate Limiting
*   [x] Implemented on `/api/auth` (20 req/15m).

### 3. Helmet Configuration
*   Currently using defaults. If you use external images/scripts later, you may need to relax `contentSecurityPolicy`.
