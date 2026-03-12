# Step 2 Milestone: Database Management API Routes

**Phase:** 10 | **Step:** 2 of 4
**Type:** API implementation

---

## Checklist

### GET `/api/projects/:id/database`
- [ ] Extracts and validates project ID from route params
- [ ] Returns 404 for non-existent project
- [ ] Calls `DatabaseProvisioner.getDatabaseInfo()`
- [ ] Returns `null` (200) when no database exists
- [ ] Returns database info with `dbName`, `dbUser`, `sizeBytes`, `activeConnections`, `connectionString`, `createdAt`
- [ ] Connection string includes decrypted password
- [ ] Protected by `withAuth`

### POST `/api/projects/:id/database`
- [ ] Extracts and validates project ID from route params
- [ ] Queries project to get `slug` for database naming
- [ ] Returns 404 for non-existent project
- [ ] Calls `DatabaseProvisioner.provision(projectId, slug)`
- [ ] Returns 201 with `dbName`, `dbUser`, `connectionString`, `message`
- [ ] Returns 409 if database already exists
- [ ] Returns 500 on RDS failure (with logged error details)
- [ ] Protected by `withAuth`

### DELETE `/api/projects/:id/database`
- [ ] Extracts and validates project ID from route params
- [ ] Parses and validates request body with Zod schema: `{ confirmName: string }`
- [ ] Returns 404 if no database exists for the project
- [ ] Returns 400 if `confirmName` does not match actual `dbName`
- [ ] Calls `DatabaseProvisioner.deprovision(projectId)`
- [ ] Returns 200 with success message
- [ ] Returns 500 on RDS failure (with logged error details)
- [ ] Protected by `withAuth`

### General
- [ ] Provisioner instantiated with env vars (`RDS_ENDPOINT`, `RDS_ADMIN_USER`, `RDS_ADMIN_PASSWORD`)
- [ ] All error responses use `errorResponse()` helper
- [ ] All success responses use `jsonResponse()` helper
- [ ] No passwords in error messages or logs
- [ ] `pnpm typecheck` passes for `apps/dashboard`

---

## Artifacts

| File | Action |
|------|--------|
| `apps/dashboard/src/app/api/projects/[id]/database/route.ts` | Modify (replace TODO stubs) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| RDS admin env vars not available in dashboard container | Add to `.env.local` for development; add to production container env |
| `@gblockparty/core/database` import may need package.json exports update | Verify `packages/core/package.json` exports the `database` module |
