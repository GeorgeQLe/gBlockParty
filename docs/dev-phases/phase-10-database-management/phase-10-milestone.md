# Phase 10: Database Management -- Milestone Tracker

**Phase:** 10 of 12
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | Database Provisioning Logic | Not Started | `packages/core/src/database/provisioner.ts` |
| 2 | Database Management API Routes | Not Started | `apps/dashboard/src/app/api/projects/[id]/database/route.ts` |
| 3 | Database Management Dashboard UI | Not Started | `apps/dashboard/src/app/projects/[id]/database/page.tsx` + components |
| 4 | Connection String & Credential Management | Not Started | Encryption, copy-to-clipboard, show/hide password |

---

## Step 1: Database Provisioning Logic

**File:** `packages/core/src/database/provisioner.ts`
**Status:** Not Started

- [ ] Implement `DatabaseProvisioner` class with admin RDS connection
- [ ] Implement `provision(projectId, projectSlug)` -- CREATE DATABASE + CREATE USER
- [ ] Generate database name as `app_{project_slug}` (sanitized, alphanumeric + underscore)
- [ ] Generate cryptographically random 32-character password via `crypto.randomBytes()`
- [ ] Execute `CREATE USER {user} WITH PASSWORD '{password}'` on RDS
- [ ] Execute `CREATE DATABASE {dbname} OWNER {user}` on RDS
- [ ] Execute `GRANT ALL PRIVILEGES ON DATABASE {dbname} TO {user}`
- [ ] Encrypt password using `encrypt()` from `@gblockparty/shared/backend`
- [ ] Insert record into `managed_databases` table via Drizzle
- [ ] Upsert `DATABASE_URL` into `env_vars` table for `production` scope
- [ ] Upsert `DATABASE_URL` into `env_vars` table for `preview` scope
- [ ] Implement `deprovision(projectId)` -- DROP DATABASE + DROP USER + cleanup
- [ ] Implement `getDatabaseInfo(projectId)` -- query `managed_databases` + `pg_database_size()` + `pg_stat_activity`
- [ ] Handle error: database already exists for project (return descriptive error)
- [ ] Handle error: RDS connection failure (retry once, then throw)
- [ ] Cleanup on partial failure: if DB created but `managed_databases` insert fails, DROP the database
- [ ] Never log passwords or connection strings with passwords
- [ ] Test: provision creates database accessible with generated credentials
- [ ] Test: deprovision removes database, user, and env vars
- [ ] Test: provision for duplicate project throws error

---

## Step 2: Database Management API Routes

**File:** `apps/dashboard/src/app/api/projects/[id]/database/route.ts`
**Status:** Not Started (TODO stub exists)

- [ ] Implement GET handler: return database info or `null` if no database exists
- [ ] GET queries `managed_databases` table by `projectId`
- [ ] GET queries `pg_database_size()` for current size in bytes
- [ ] GET queries `pg_stat_activity` for active connection count
- [ ] GET returns: `{ dbName, dbUser, sizeBytes, activeConnections, connectionString, createdAt }` or `null`
- [ ] GET decrypts password to construct `connectionString` for the response
- [ ] Implement POST handler: call `DatabaseProvisioner.provision()`
- [ ] POST validates project exists and belongs to authenticated user
- [ ] POST returns 409 if database already exists for this project
- [ ] POST returns created database info on success (201 status)
- [ ] Implement DELETE handler: call `DatabaseProvisioner.deprovision()`
- [ ] DELETE requires body `{ "confirmName": "app_{slug}" }` matching the actual database name
- [ ] DELETE returns 400 if confirmation name does not match
- [ ] DELETE returns 404 if no database exists for this project
- [ ] All routes protected by `withAuth` wrapper
- [ ] All routes validate project ID is a valid UUID
- [ ] Test: GET returns null for project with no database
- [ ] Test: POST creates database and returns info
- [ ] Test: POST returns 409 on duplicate
- [ ] Test: DELETE with correct confirmation removes database
- [ ] Test: DELETE with wrong confirmation returns 400

---

## Step 3: Database Management Dashboard UI

**File:** `apps/dashboard/src/app/projects/[id]/database/page.tsx` + components
**Status:** Not Started (placeholder exists)

### No Database State
- [ ] Display "Create Database" call-to-action with description
- [ ] Create Database button opens confirmation dialog
- [ ] Confirmation dialog explains what will happen (database name, auto-set DATABASE_URL)
- [ ] On confirm, POST to API, show loading state, refresh page on success
- [ ] Handle and display API errors

### Database Exists State
- [ ] Display database name and user
- [ ] Display connection string with show/hide password toggle (default: hidden)
- [ ] Copy-to-clipboard button for connection string with visual feedback (checkmark for 2s)
- [ ] Display database size (formatted: KB/MB/GB)
- [ ] Display active connection count
- [ ] Display creation date
- [ ] Show "DATABASE_URL is automatically set for production and preview" info note
- [ ] Delete Database button with double-confirmation dialog

### Delete Database Dialog
- [ ] Warning message about irreversible action
- [ ] User must type database name to enable delete button
- [ ] On confirm, DELETE to API, show loading state, refresh page on success
- [ ] Handle and display API errors

### General
- [ ] Use SWR for data fetching with revalidation
- [ ] Loading skeleton while fetching
- [ ] Error state display
- [ ] Responsive layout
- [ ] Test: page renders "Create Database" when no DB exists
- [ ] Test: page renders connection info when DB exists
- [ ] Test: copy button copies connection string to clipboard

---

## Step 4: Connection String & Credential Management

**Status:** Not Started

- [ ] Connection string format: `postgresql://{user}:{password}@{rds-endpoint}:5432/{dbname}?sslmode=require`
- [ ] RDS endpoint sourced from `RDS_ENDPOINT` env var (or parsed from platform `DATABASE_URL`)
- [ ] Password encrypted with AES-256-GCM using `encrypt()` from `packages/shared/src/backend/encryption.ts`
- [ ] Password decrypted server-side only via `decrypt()` -- never sent to client by default
- [ ] GET API returns connection string with decrypted password (behind auth)
- [ ] Password display in UI: default `****...****` with eye icon toggle
- [ ] Copy-to-clipboard copies the FULL connection string (with real password)
- [ ] Clipboard write uses `navigator.clipboard.writeText()` with fallback
- [ ] Visual feedback on copy: button text changes to "Copied!" with checkmark icon for 2 seconds
- [ ] Connection string displayed in monospace font with proper wrapping
- [ ] No password appears in browser console, network tab logs, or React DevTools state (password fetched on demand)
- [ ] Test: encrypted password round-trips through encrypt/decrypt correctly
- [ ] Test: connection string format is valid PostgreSQL connection string
- [ ] Test: copy-to-clipboard copies correct value

---

## Completion Checklist

- [ ] All 4 steps completed and individually verified
- [ ] `DatabaseProvisioner.provision()` creates a working database on RDS
- [ ] `DatabaseProvisioner.deprovision()` fully cleans up database, user, and env vars
- [ ] API routes return correct data for all states (no DB, DB exists)
- [ ] Dashboard UI handles all states (loading, no DB, DB exists, error)
- [ ] Connection string is correct and app can connect with generated credentials
- [ ] `DATABASE_URL` appears in env vars for both production and preview scopes
- [ ] Encrypted credentials survive a round-trip (encrypt -> store -> retrieve -> decrypt)
- [ ] Delete confirmation prevents accidental deletion
- [ ] `pnpm typecheck` passes with no errors across all packages
- [ ] Phase 10 spec acceptance criteria all satisfied

---

## Notes

_Use this section to record decisions, blockers, or deviations during implementation._
