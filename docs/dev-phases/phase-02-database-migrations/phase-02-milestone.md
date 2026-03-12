# Phase 2 Milestone: Database & Migrations

**Phase:** 2 of 4
**Status:** Not Started
**Target:** All database migrations applied, schema verified, connection pool configured

---

## Milestone Checklist

### Step 1: Generate Drizzle Migrations
- [ ] Run `pnpm db:generate` from workspace root
- [ ] Migration SQL file(s) created in `packages/shared/src/db/migrations/`
- [ ] Generated SQL creates all 7 tables: `projects`, `deployments`, `env_vars`, `managed_databases`, `github_installations`, `port_allocations`, `notification_settings`
- [ ] All columns have correct SQL types (uuid, text, bigint, integer, boolean, timestamptz)
- [ ] All `DEFAULT` values are correct (gen_random_uuid(), now(), 'queued', 'main', false, true, 0)
- [ ] All `NOT NULL` constraints match schema definition
- [ ] All 4 foreign keys are present with `ON DELETE CASCADE`
- [ ] All 4 indexes are created: `idx_deployments_project_created`, `idx_deployments_status`, `idx_env_vars_project_scope`, `idx_port_allocations_deployment`
- [ ] All unique constraints are present: `projects.slug`, `projects.github_repo_full_name`, `managed_databases.db_name`, `env_vars(project_id, scope, key)`
- [ ] Migration file committed to version control

### Step 2: Run Migrations & Verify Schema
- [ ] `DATABASE_URL` is set with RDS endpoint and `?sslmode=require`
- [ ] `pnpm db:migrate` completes without errors
- [ ] All 7 tables exist in the `gblockparty` database (verified with `\dt` or information_schema query)
- [ ] Column types verified for all tables via `\d tablename` or information_schema
- [ ] All indexes verified with `\di` or `pg_indexes` query
- [ ] All foreign key constraints verified
- [ ] All unique constraints verified
- [ ] CRUD test: INSERT a row into `projects`, SELECT it, UPDATE it, DELETE it
- [ ] CRUD test: INSERT a row into `deployments` (with FK to project), verify cascade delete
- [ ] CRUD test: INSERT into `env_vars` with unique constraint, verify duplicate key rejection
- [ ] CRUD test: INSERT into `managed_databases`, `github_installations`, `port_allocations`, `notification_settings`
- [ ] Drizzle `__drizzle_migrations` journal table exists and records the applied migration

### Step 3: Database Connection Pool Configuration
- [ ] `createDb()` in `packages/shared/src/db/index.ts` configured with pool options (max connections, idle timeout, SSL)
- [ ] Pool max connections set to 10 (appropriate for `db.t4g.micro` with ~85 max connections)
- [ ] Idle timeout set to 30 seconds
- [ ] SSL mode enforced (`ssl: { rejectUnauthorized: false }` or `sslmode=require` in URL)
- [ ] `getDb()` singleton in `apps/dashboard/src/lib/db.ts` verified to return same instance on repeated calls
- [ ] Connection test from local dev machine succeeds
- [ ] Connection test from VPS succeeds
- [ ] Pool properly releases idle connections (no connection leak on repeated queries)
- [ ] Error handling: `getDb()` throws clear error when `DATABASE_URL` is missing

---

## Definition of Done

Phase 2 is complete when:

1. Migration SQL files exist in `packages/shared/src/db/migrations/` and are committed.
2. All 7 tables are present on the RDS instance with correct structure.
3. All indexes, foreign keys, and unique constraints are in place.
4. The connection pool is configured for production use.
5. `getDb()` returns a working Drizzle ORM instance connected to RDS over SSL.
6. Connectivity is verified from both local dev and the VPS.

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Migration SQL files | `packages/shared/src/db/migrations/` |
| Updated `createDb()` with pool config | `packages/shared/src/db/index.ts` |
| Verified `getDb()` singleton | `apps/dashboard/src/lib/db.ts` |
| Migration applied to RDS | `gblockparty` database on RDS instance |

---

## Sign-Off

| Step | Completed | Date | Notes |
|------|-----------|------|-------|
| Step 1: Generate Migrations | [ ] | | |
| Step 2: Run Migrations & Verify | [ ] | | |
| Step 3: Connection Pool Config | [ ] | | |
| **Phase 2 Complete** | [ ] | | |
