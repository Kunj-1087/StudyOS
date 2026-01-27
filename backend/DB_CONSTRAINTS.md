# Database Constraints & Safety

Database constraints are the final line of defense for data integrity. They prevent bugs that application-level validation might miss due to race conditions or direct DB access.

## Implemented Constraints

### 1. Unique Constraints (`UNIQUE`)
*   **User Email**: `email String @unique`
    *   **Prevention**: Prevents two users from registering with the same email.
*   **Subject Uniqueness**: `@@unique([userId, name])` (Added to `Subject`)
    *   **Prevention**: Prevents a user from creating two subjects named "Math".
    *   **Bug Scenario**: Without this, if a user double-clicks "Create" quickly, two API requests might pass the "Does existing subject exist?" check simultaneously (Race Condition) and insert duplicates. The DB constraint ensures one fails.

### 2. Foreign Keys (`REFERENCES`)
*   **User -> Subjects**: `user User @relation(...)`
    *   **Prevention**: Ensures a subject cannot exist without a valid `userId`.
    *   **Cascading**: If a User is deleted, we can configure `onDelete: Cascade` to automatically remove their subjects (preventing orphaned records). Currently default Prisma behavior protects deletion.

## Advanced Constraints (Requires Raw SQL)

Prisma Schema doesn't support arbitrary `CHECK` constraints (e.g., ensuring a string matches a Regex) natively. To add these, we must use **Raw SQL Migrations**.

### CHECK Constraints
A `CHECK` constraint ensures data meets a condition *before* saving.

**Example: Enforcing Hex Color Code**
We validate colors in the API (`zod`), but bad data could still be inserted via a seed script or admin tool.

**SQL to apply manually:**
```sql
ALTER TABLE "Subject"
ADD CONSTRAINT "Subject_color_check"
CHECK ("color" ~* '^#[a-f0-9]{6}$');
```

**How to implement:**
1.  `npx prisma migrate dev --create-only --name add_color_check`
2.  Edit the generated `migration.sql` file to include the SQL above.
3.  Run `npx prisma migrate dev` to apply.

## Why this matters?
Application validation (`zod`) is great for user feedback, but Database Constraints capture "impossible" states and ensure data consistency regardless of where the data comes from (API, Script, Manual import).
