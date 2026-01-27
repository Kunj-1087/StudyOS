# Backup & Restore Plan

## 1. Environments & Strategies

### Development (Local)
*   **Strategy**: Manual / On-demand.
*   **Tool**: `pg_dump` local CLI.
*   **Frequency**: Users run it before aggressive migrations (`migrate reset`).
*   **Retention**: None.

### Staging
*   **Strategy**: Automated Daily Backups.
*   **Tool**: Managed Database Service (e.g., AWS RDS, Neon, Supabase) or Cron Job.
*   **Frequency**: Once every 24 hours (Midnight).
*   **Retention**: 7 Days.
*   **Purpose**: To test "restore from production" scenarios and safe playground.

### Production
*   **Strategy**: Automated Daily + WAL Archiving (Point-in-Time Recovery).
*   **Tool**: Managed Provider (Recommended) or Scripts.
*   **Frequency**:
    *   **Full Backup**: Daily.
    *   **Incremental**: Continuous (via WAL logs) or Hourly.
*   **Retention**: 30 Days.
*   **Encryption**: Backups must be encrypted at rest.

## 2. Restore Procedures

### How to Restore (CLI)
Using standard PostgreSQL tools:

**Backup (Dump)**
```bash
# Dump specific database to a compressed file
pg_dump -h <host> -U <user> -d <db_name> -F c -f backup_$(date +%Y%m%d).dump
```

**Restore**
```bash
# Restore from dump file
pg_restore -h <host> -U <user> -d <db_name> --clean --if-exists backup_20240101.dump
```

## 3. Testing Restores (Drill)
Backups are useless if they cannot be restored.

**Frequency**: Monthly.

**Procedure**:
1.  **Spin up a fresh DB instance** (Staging or Temporary).
2.  **Import** the latest Production backup.
3.  **Run Verification Script**:
    *   Check row counts of critical tables (`User`, `Subject`).
    *   Run a simple `SELECT` query on recent data.
    *   Check `updatedAt` of the latest record matches the backup time.
4.  **Destroy** the temporary instance.

## 4. Disaster Recovery (DR) Checklist
*   [ ] Access key to backup storage (S3/GCS) is available off-site?
*   [ ] Database Version matches Backup Version?
*   [ ] Restore Time Objective (RTO): Target < 1 Hour.
*   [ ] Restore Point Objective (RPO): Target < 1 Hour data loss.
