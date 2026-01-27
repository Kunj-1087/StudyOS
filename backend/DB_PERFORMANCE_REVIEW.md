# Database Performance & Index Review

## Current Schema Analysis

### `User` Table
*   **PK**: `id` (UUID) - Standard Primary Key.
*   **Unique**: `email` - Implicit B-Tree index created by `@unique`.
    *   **Benefit**: Essential for `findUnique({ where: { email } })` used during **Login** and **Registration**.
    *   **SQL**: `CREATE UNIQUE INDEX "User_email_key" ON "User"("email");`

### `Subject` Table
*   **PK**: `id` (UUID).
*   **FK**: `userId`. Current Index: `@@index([userId])`.
    *   **Benefit**: Critical for `findMany({ where: { userId } })`. Without this, fetching a user's subjects would trigger a full table scan of the `Subject` table.
*   **Search**: `name`. Current Index: `@@index([name])`.
    *   **Benefit**: Helps `contains` or exact match searches on name.

## Proposed Optimizations

### 1. Composite Index for User Scoped Search
**Proposal**: Change `@@index([name])` to `@@index([userId, name])`.
*   **Why**: We *always* filter by `userId` first. Searching for a subject name is always scoped to the current user. `WHERE "userId" = ? AND "name" LIKE ?`.
*   **Efficiency**: A composite index narrows down to the user's records first, then filters by name within that subset.
*   **Prisma**: `@@index([userId, name])`
*   **SQL**: `CREATE INDEX "Subject_userId_name_idx" ON "Subject"("userId", "name");`

### 2. Sorting Index (Pagination)
**Proposal**: Add index on `[userId, createdAt]`.
*   **Why**: The default dashboard view lists subjects sorted by creation date (`orderBy: { createdAt: 'desc' }`).
*   **Slow Query Risk**: As table grows, sorting strictly by `createdAt` after filtering by `userId` requires an in-memory sort (FileSort) if not indexed.
*   **Prisma**: `@@index([userId, createdAt])`
*   **SQL**: `CREATE INDEX "Subject_userId_createdAt_idx" ON "Subject"("userId", "createdAt");`

## Common Slow Queries to Watch

1.  **Text Search (`contains`)**
    *   **Query**: `SELECT * FROM "Subject" WHERE "name" ILIKE '%math%'`
    *   **Issue**: Standard B-Tree indexes (like the ones proposed) are **not** effective for leading wildcard searches (`%math%`). They only work for prefix searches (`math%`).
    *   **Solution**: If full-text search becomes slow, switch to PostgreSQL **GIN Index** with `tsvector` or use an external search engine (part of a future Async Job).

2.  **Aggregation (`count`)**
    *   **Query**: `SELECT COUNT(*) FROM "Subject" WHERE "userId" = ?`
    *   **Issue**: Postgres `COUNT(*)` can be slow on huge tables (millions of rows) due to MVCC visibility checks.
    *   **Mitigation**: The `userId` index helps significantly here.

## Recommended `schema.prisma` Updates

```prisma
model Subject {
  // ... fields

  @@index([userId]) // Keep for foreign key lookups
  @@index([userId, name]) // For scoped searching
  @@index([userId, createdAt]) // For default dashboard sorting
}
```
