# Step 1 Milestone: CLI API Routes

**Phase:** 9 -- CLI Tool
**Step:** 1 of 7

---

## Checklist

### Deploy Route (`POST /api/cli/deploy`)

- [ ] Handler unwrapped from 501 stub and fully implemented
- [ ] Validates `projectId` is present in request body (returns 400 if missing)
- [ ] Looks up project by ID (returns 404 if not found)
- [ ] Creates a deployment record with status `queued` and correct `type` (`production` or `preview`)
- [ ] Calls `queueDeployment(deploymentId)` to start async build
- [ ] Returns `{ deploymentId, type, branch, streamUrl }` with 200 status
- [ ] Returns 401 when no Authorization header is present
- [ ] Returns 401 when an invalid Bearer token is provided

### Env GET Route (`GET /api/cli/env/:projectId`)

- [ ] Handler returns env vars for the requested `scope` query parameter
- [ ] Defaults to `"production"` scope when no `scope` param is provided
- [ ] Returns 400 for invalid scope values (not `"production"` or `"preview"`)
- [ ] Returns 404 when the project does not exist
- [ ] Secret values are masked as `"***"` in the response
- [ ] Non-secret values are returned in cleartext
- [ ] Each var includes `key`, `value`, and `isSecret` fields
- [ ] Returns 401 without valid auth

### Env POST Route (`POST /api/cli/env/:projectId`)

- [ ] Handler upserts env vars into the `env_vars` table
- [ ] Validates `scope` is `"production"` or `"preview"` (returns 400 otherwise)
- [ ] Validates `vars` is a non-empty array (returns 400 otherwise)
- [ ] Uses `ON CONFLICT DO UPDATE` to upsert by `(project_id, scope, key)` composite unique
- [ ] Returns `{ projectId, scope, updated }` with the count of upserted vars
- [ ] Returns 404 when the project does not exist
- [ ] Returns 401 without valid auth

### General

- [ ] `pnpm typecheck` passes with no errors
- [ ] Both route files compile and are importable by Next.js
- [ ] Auth middleware (`withAuth`) correctly extracts Bearer tokens from the Authorization header

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Deploy route implemented | [ ] | |
| Env GET route implemented | [ ] | |
| Env POST route implemented | [ ] | |
| Auth validation working | [ ] | |
| Type-check passing | [ ] | |
| **Step 1 complete** | [ ] | |
