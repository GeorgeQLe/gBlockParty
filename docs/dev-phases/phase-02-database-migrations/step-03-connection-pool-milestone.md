# Step 3 Milestone: Database Connection Pool Configuration

**Phase:** 2 -- Database & Migrations
**Step:** 3 of 3

---

## Checklist

### Code Changes
- [ ] `packages/shared/src/db/index.ts` updated with `DbPoolOptions` interface
- [ ] `createDb()` accepts optional `max`, `idleTimeoutMillis`, `connectionTimeoutMillis` parameters
- [ ] Default pool max set to 10
- [ ] Default idle timeout set to 30,000ms (30 seconds)
- [ ] Default connection timeout set to 10,000ms (10 seconds)
- [ ] SSL configured: respects `sslmode=` in connection string, falls back to `ssl: { rejectUnauthorized: false }`
- [ ] `apps/dashboard/src/lib/db.ts` reviewed -- no changes needed (singleton pattern already correct)

### Singleton Verification
- [ ] `getDb()` returns the same instance when called multiple times (`db1 === db2`)
- [ ] `getDb()` throws clear error when `DATABASE_URL` is not set
- [ ] Singleton persists across multiple API route invocations in Next.js

### Connectivity Tests
- [ ] Connection from local dev to RDS succeeds
- [ ] `SELECT current_database()` returns `gblockparty`
- [ ] `SHOW ssl` returns `on` (SSL is active)
- [ ] Connection from VPS to RDS succeeds
- [ ] `pnpm db:migrate` runs from VPS without errors (idempotent -- "Migrations complete.")

### Drizzle ORM Integration
- [ ] `db.select().from(projects)` returns results (empty array or existing data)
- [ ] `db.insert(projects).values(...)` succeeds and returns inserted row
- [ ] `db.delete(projects).where(...)` succeeds
- [ ] Full CRUD through Drizzle ORM works end-to-end

### Pool Behavior
- [ ] Pool creates connections on demand (not pre-allocated)
- [ ] Pool respects max connection limit
- [ ] Idle connections released after timeout
- [ ] Connection timeout triggers clear error (not infinite hang)
- [ ] No connection leaks after repeated queries

### Type Safety
- [ ] `Database` type export still works: `type Database = ReturnType<typeof createDb>`
- [ ] `DbPoolOptions` interface is exported from `@gblockparty/shared/db`
- [ ] `pnpm typecheck` passes across all packages

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Pool configuration implemented | [ ] | |
| Singleton verified | [ ] | |
| Local dev connectivity OK | [ ] | |
| VPS connectivity OK | [ ] | |
| SSL confirmed active | [ ] | |
| Drizzle ORM queries work | [ ] | |
| Pool behavior verified | [ ] | |
| Types pass | [ ] | |
| **Step 3 complete** | [ ] | |
