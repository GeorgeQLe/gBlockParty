# Step 2 Milestone: Deployments API Routes

**Phase:** 6, Step 2
**Status:** Not Started

---

## Checklist

### GET /api/projects/:id/deployments
- [ ] Extracts `id` from route params and verifies project exists (404 if not)
- [ ] Reads `page` and `limit` query params with defaults (page=1, limit=20)
- [ ] Clamps `limit` to range [1, 100]
- [ ] Queries total count of deployments for the project
- [ ] Queries deployments with offset and limit, ordered by `createdAt DESC`
- [ ] Returns `{ data, total, page, limit }` response format
- [ ] Supports optional `?type=production|preview|rollback` filter
- [ ] Returns empty data array with total=0 for projects with no deployments
- [ ] Returns 401 without valid session cookie

### POST /api/projects/:id/deployments
- [ ] Extracts `id` from route params and verifies project exists (404 if not)
- [ ] Parses and validates body with `triggerDeploymentSchema`
- [ ] Returns 400 with Zod error details on validation failure
- [ ] Falls back to project's `productionBranch` when `branch` not provided
- [ ] Sets `commitSha` to null when not provided
- [ ] Defaults `type` to `"production"` when not provided
- [ ] Creates deployment record in database with status `"queued"`
- [ ] Enqueues build via `BuildQueue.enqueue()` (async, does not block response)
- [ ] Returns 201 with the created deployment object
- [ ] Response time under 500ms (build runs asynchronously)
- [ ] Returns 401 without valid session cookie

### GET /api/projects/:id/deployments/:did
- [ ] Extracts `id` and `deploymentId` from route params
- [ ] Verifies project exists (404 if not)
- [ ] Queries deployment by ID AND projectId (ensures deployment belongs to project)
- [ ] Returns 404 when deployment does not exist or belongs to different project
- [ ] Returns full deployment object with all fields
- [ ] Includes `buildLogUrl` field (constructed from `buildLogS3Key`, null if no logs yet)
- [ ] Returns 401 without valid session cookie

### Build Queue Singleton
- [ ] `getBuildQueue()` created in `apps/dashboard/src/lib/build-queue.ts`
- [ ] Returns same `BuildQueue` instance across calls (singleton)
- [ ] Queue properly replaces queued items for same project (cancel-and-replace)

### General
- [ ] All routes use `getDb()` singleton for database access
- [ ] All routes use `withAuth` middleware
- [ ] No TypeScript errors
- [ ] Error responses follow consistent format

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| GET /api/projects/:id/deployments | [ ] | |
| POST /api/projects/:id/deployments | [ ] | |
| GET /api/projects/:id/deployments/:did | [ ] | |
| Build queue singleton | [ ] | |
| Manual testing complete | [ ] | |
| **Step 2 Complete** | [ ] | |
