# Step 1 Milestone: Database Provisioning Logic

**Phase:** 10 | **Step:** 1 of 4
**Type:** Backend implementation

---

## Checklist

### DatabaseProvisioner Class
- [ ] Class created at `packages/core/src/database/provisioner.ts`
- [ ] Constructor accepts `DatabaseProvisionerOptions` (db, rdsEndpoint, rdsPort, rdsAdminUser, rdsAdminPassword)
- [ ] Admin `pg.Client` connections created on-demand and closed after each operation
- [ ] Barrel export at `packages/core/src/database/index.ts`

### provision(projectId, projectSlug)
- [ ] Sanitizes slug: non-alphanumeric replaced with `_`, lowercase, max 50 chars, starts with letter
- [ ] Database name: `app_{sanitized_slug}`
- [ ] Username: `app_{sanitized_slug}_user`
- [ ] Checks for existing database (throws `DatabaseAlreadyExistsError` if found)
- [ ] Generates 32-character URL-safe password via `crypto.randomBytes(24).toString('base64url')`
- [ ] Executes `CREATE USER` with generated password
- [ ] Executes `CREATE DATABASE` with correct owner
- [ ] Executes `GRANT ALL PRIVILEGES`
- [ ] Encrypts password with `encrypt()` from `@gblockparty/shared/backend`
- [ ] Inserts row into `managed_databases` table
- [ ] Upserts `DATABASE_URL` into `env_vars` for `production` scope with `isSecret: true`
- [ ] Upserts `DATABASE_URL` into `env_vars` for `preview` scope with `isSecret: true`
- [ ] Connection string format: `postgresql://{user}:{password}@{rdsEndpoint}:5432/{dbname}?sslmode=require`
- [ ] Returns `{ dbName, dbUser, connectionString }`

### deprovision(projectId)
- [ ] Looks up database from `managed_databases` by `projectId`
- [ ] Throws `DatabaseNotFoundError` if no database exists
- [ ] Terminates active connections with `pg_terminate_backend()`
- [ ] Executes `DROP DATABASE IF EXISTS`
- [ ] Executes `DROP USER IF EXISTS`
- [ ] Deletes row from `managed_databases`
- [ ] Deletes `DATABASE_URL` rows from `env_vars` for both scopes

### getDatabaseInfo(projectId)
- [ ] Returns `null` if no database exists for the project
- [ ] Queries `pg_database_size()` for current size
- [ ] Queries `pg_stat_activity` for active connection count
- [ ] Decrypts password to construct connection string
- [ ] Returns `{ dbName, dbUser, sizeBytes, activeConnections, connectionString, createdAt }`

### Error Handling & Security
- [ ] Partial failure during provision triggers DDL cleanup (DROP USER/DATABASE)
- [ ] No passwords logged (structured logging excludes sensitive fields)
- [ ] Admin connection closed in `finally` block
- [ ] SQL identifiers double-quoted to prevent injection

### Tests
- [ ] provision() creates database accessible with generated credentials
- [ ] provision() for duplicate project throws descriptive error
- [ ] deprovision() fully removes database, user, and env vars
- [ ] getDatabaseInfo() returns accurate size and connection count
- [ ] Password round-trips through encrypt/decrypt correctly
- [ ] sanitizeSlug() handles edge cases (special chars, starts with number, too long)

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/database/provisioner.ts` | Create |
| `packages/core/src/database/index.ts` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Need RDS admin credentials available as env vars | Document required env vars; add to `.env.example` |
| `pg` npm package may not be installed in `packages/core` | Add `pg` and `@types/pg` to `packages/core/package.json` |
| DDL commands cannot run inside a transaction on external databases | Use separate admin connection; handle cleanup manually |
