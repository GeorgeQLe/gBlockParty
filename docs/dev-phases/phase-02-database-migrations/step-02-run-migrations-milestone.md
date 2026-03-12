# Step 2 Milestone: Run Migrations & Verify Schema

**Phase:** 2 -- Database & Migrations
**Step:** 2 of 3

---

## Checklist

### Prerequisites
- [ ] Step 1 complete -- migration files exist in `packages/shared/src/db/migrations/`
- [ ] RDS PostgreSQL instance is running (Phase 1)
- [ ] `DATABASE_URL` env var is set with `?sslmode=require`
- [ ] Network connectivity to RDS verified (`pg_isready` or `psql` connects)

### Migration Execution
- [ ] `pnpm db:migrate` completes with "Migrations complete." output
- [ ] No errors in migration output

### Table Existence (8 tables including journal)
- [ ] `projects` exists
- [ ] `deployments` exists
- [ ] `env_vars` exists
- [ ] `managed_databases` exists
- [ ] `github_installations` exists
- [ ] `port_allocations` exists
- [ ] `notification_settings` exists
- [ ] `__drizzle_migrations` exists (journal)

### Column Verification
- [ ] `projects` -- 13 columns, correct types verified via `\d projects`
- [ ] `deployments` -- 17 columns, correct types verified via `\d deployments`
- [ ] `env_vars` -- 8 columns, correct types verified via `\d env_vars`
- [ ] `managed_databases` -- 7 columns, correct types verified via `\d managed_databases`
- [ ] `github_installations` -- 4 columns, correct types verified via `\d github_installations`
- [ ] `port_allocations` -- 3 columns, correct types verified via `\d port_allocations`
- [ ] `notification_settings` -- 6 columns, correct types verified via `\d notification_settings`

### Index Verification
- [ ] `idx_deployments_project_created` exists on `deployments(project_id, created_at)`
- [ ] `idx_deployments_status` exists on `deployments(status)`
- [ ] `idx_env_vars_project_scope` exists on `env_vars(project_id, scope)`
- [ ] `idx_port_allocations_deployment` exists on `port_allocations(deployment_id)`

### Foreign Key Verification (all ON DELETE CASCADE)
- [ ] `deployments.project_id` -> `projects.id`
- [ ] `env_vars.project_id` -> `projects.id`
- [ ] `managed_databases.project_id` -> `projects.id`
- [ ] `port_allocations.deployment_id` -> `deployments.id`

### Unique Constraint Verification
- [ ] `projects.slug` -- duplicate insertion rejected
- [ ] `projects.github_repo_full_name` -- duplicate insertion rejected
- [ ] `managed_databases.db_name` -- duplicate insertion rejected
- [ ] `env_vars(project_id, scope, key)` -- composite duplicate rejected, different scope allowed

### CRUD Tests
- [ ] `projects`: INSERT, SELECT, UPDATE verified
- [ ] `deployments`: INSERT with FK, SELECT with JOIN, UPDATE verified
- [ ] `env_vars`: INSERT verified, composite unique constraint tested (same key different scope OK)
- [ ] `managed_databases`: INSERT verified, size_bytes default = 0 confirmed
- [ ] `github_installations`: INSERT verified with bigint ID
- [ ] `port_allocations`: INSERT verified with integer port PK
- [ ] `notification_settings`: INSERT verified, boolean defaults confirmed (true, true)

### CASCADE Delete Test
- [ ] Delete a project cascades to delete its deployments
- [ ] Delete a project cascades to delete its env_vars
- [ ] Delete a project cascades to delete its managed_databases
- [ ] Delete a deployment cascades to delete its port_allocations

### Cleanup
- [ ] All test data removed after verification

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Migration applied | [ ] | |
| All tables verified | [ ] | |
| All indexes verified | [ ] | |
| All FKs and constraints verified | [ ] | |
| CRUD tests passed | [ ] | |
| CASCADE delete verified | [ ] | |
| Test data cleaned up | [ ] | |
| **Step 2 complete** | [ ] | |
