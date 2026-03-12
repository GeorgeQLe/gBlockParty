# Step 1 Milestone: Generate Drizzle Migrations

**Phase:** 2 -- Database & Migrations
**Step:** 1 of 3

---

## Checklist

### Generation
- [ ] `pnpm db:generate` runs without errors
- [ ] Migration file(s) created in `packages/shared/src/db/migrations/`
- [ ] `meta/_journal.json` created
- [ ] `meta/0000_snapshot.json` created

### Table Verification (7 tables)
- [ ] `CREATE TABLE "projects"` -- 13 columns
- [ ] `CREATE TABLE "deployments"` -- 17 columns
- [ ] `CREATE TABLE "env_vars"` -- 8 columns
- [ ] `CREATE TABLE "managed_databases"` -- 7 columns
- [ ] `CREATE TABLE "github_installations"` -- 4 columns
- [ ] `CREATE TABLE "port_allocations"` -- 3 columns
- [ ] `CREATE TABLE "notification_settings"` -- 6 columns

### Foreign Key Verification (4 FKs)
- [ ] `deployments.project_id` -> `projects.id` ON DELETE CASCADE
- [ ] `env_vars.project_id` -> `projects.id` ON DELETE CASCADE
- [ ] `managed_databases.project_id` -> `projects.id` ON DELETE CASCADE
- [ ] `port_allocations.deployment_id` -> `deployments.id` ON DELETE CASCADE

### Index Verification (4 indexes)
- [ ] `idx_deployments_project_created` on `(project_id, created_at)`
- [ ] `idx_deployments_status` on `(status)`
- [ ] `idx_env_vars_project_scope` on `(project_id, scope)`
- [ ] `idx_port_allocations_deployment` on `(deployment_id)`

### Unique Constraint Verification
- [ ] `projects.slug` UNIQUE
- [ ] `projects.github_repo_full_name` UNIQUE
- [ ] `managed_databases.db_name` UNIQUE
- [ ] `env_vars_project_scope_key` UNIQUE on `(project_id, scope, key)`

### Column Type Spot-Checks
- [ ] All `id` PKs are `uuid` with `DEFAULT gen_random_uuid()`
- [ ] `github_installations.id` is `bigint` (no default)
- [ ] `port_allocations.port` is `integer` (no default)
- [ ] All timestamps are `timestamp with time zone` with `DEFAULT now()`
- [ ] `managed_databases.size_bytes` is `bigint` with `DEFAULT 0`
- [ ] `deployments.status` default is `'queued'`
- [ ] `projects.production_branch` default is `'main'`

### Commit
- [ ] Migration files added to git staging
- [ ] Committed with descriptive message

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Generation successful | [ ] | |
| SQL reviewed and correct | [ ] | |
| Files committed | [ ] | |
| **Step 1 complete** | [ ] | |
