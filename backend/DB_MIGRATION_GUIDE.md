# Database Migration Guide

This project uses **Prisma** for database migrations.

## Scripts

We have provided npm scripts in `backend/package.json` to manage migrations:

| Script | Command | Description |
|--------|---------|-------------|
| `npm run migrate:dev` | `prisma migrate dev` | **Development**: Applies schema changes to local DB and generates a new migration file. |
| `npm run migrate:prod` | `prisma migrate deploy` | **Production**: Applies pending migrations to the database. Does NOT generate files. |
| `npm run migrate:reset` | `prisma migrate reset` | **Reset**: Drops the database, recreates it, runs migrations, and seed data. (Data loss!) |
| `npm run studio` | `prisma studio` | Opens a web GUI to view and edit database records. |

## Workflow

1.  **Modify Schema**: Edit `backend/prisma/schema.prisma`.
2.  **Generate Migration**: Run `npm run migrate:dev -- --name <descriptive-name>`.
    *   Example: `npm run migrate:dev -- --name add_profile_image`
3.  **Commit**: Commit the generated SQL file in `prisma/migrations/`.

## Rollback Strategy

Prisma uses a **forward-only** migration philosophy. There is no simple `migrate down` command.

**To Rollback a change:**

1.  Revert the changes in `schema.prisma` to the desired previous state.
2.  Run `npm run migrate:dev -- --name revert_feature_x`.
3.  This creates a new migration that undoes the changes in the database.

**If a migration fails mid-way:**

1.  Fix the issue in the SQL file or schema.
2.  Run `npx prisma migrate resolve --rolled-back <migration_name>` to mark it as rolled back (if applied partially) or fix the drift.
3.  Re-try `migrate:dev`.

## Best Practices

*   **Never edit migration SQL files manually** after they have been applied to production.
*   **Check compatibility**: Ensure valid data exists before adding `Non-Null` columns (provide a default value).
*   **Review SQL**: Always verify the generated SQL in `prisma/migrations` before committing.
