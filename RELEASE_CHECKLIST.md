# Release Checklist

## 1. Pre-Flight Checks (Local)
*   [ ] **Tests**: Run `npm run test` (Backend) and `npm run build` (Frontend). All pass?
*   [ ] **Migrations**:
    *   Any schema changes?
    *   If yes, have you generated a migration? (`npm run migrate:dev -- --name <feature>`)
    *   Is the migration "safe" (no data loss)?
*   [ ] **Env Vars**: Do you need new `.env` variables in Production (Render/Vercel)? Add them now.
*   [ ] **Clean State**: Ensure no uncommitted changes are sneaking in.

## 2. Deployment Steps

### Phase A: Database (If Schema Changed)
*   [ ] Backup Production DB (Manual Snapshot via Neon/Supabase/PGDump).
*   [ ] Run `npx prisma migrate deploy` against Production.
    *   *Tip: Render can do this automatically in the build command.*

### Phase B: Backend (Render)
*   [ ] Push to `main`.
*   [ ] Monitor Render Build Logs.
*   [ ] Verify `Health Check` returns 200 OK (`/health`).
*   [ ] Check Logs for startup errors (`npm run logs` or dashboard).

### Phase C: Frontend (Vercel)
*   [ ] Push to `main` (auto-deploys).
*   [ ] Verify Vercel Build.
*   [ ] Check the live URL. Is the new UI loading?

## 3. Post-Release Verification
*   [ ] **Smoke Test**: Login, Create a Subject, and Reload Page.
*   [ ] **Monitoring**: Watch logs for 5 minutes. Any 500 errors?

## 4. Emergency Rollback

**Scenario: Backend Crashing Loop**
1.  **Revert Code**: `git revert HEAD` locally and push.
2.  **Redeploy**: Render picks up the revert and deploys the stable code.

**Scenario: Bad Database Migration**
1.  **Stop App**: Pause Render Service to stop writing bad data.
2.  **Rollback DB**:
    *   *Option A (Small)*: Run `prisma migrate resolve --rolled-back` and manually fix SQL.
    *   *Option B (Nuclear)*: Restore the Backup taken in Phase A.
3.  **Redeploy**: Restart App.
