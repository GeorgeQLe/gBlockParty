# Step 1 Milestone: Projects API Routes

**Phase:** 6, Step 1
**Status:** Not Started

---

## Checklist

### GET /api/projects
- [ ] Returns array of all projects from the database
- [ ] Projects ordered by `createdAt DESC`
- [ ] Each project includes `latestDeployment` with status, url, and createdAt (or null if no deployments)
- [ ] Returns empty array `[]` when no projects exist
- [ ] Returns 401 without valid session cookie

### POST /api/projects
- [ ] Parses request body as JSON
- [ ] Validates body with `createProjectSchema` from `@gblockparty/shared/validation`
- [ ] Returns 400 with Zod error details on validation failure
- [ ] Generates URL-safe slug from project name (lowercase, hyphens, no special chars)
- [ ] Handles slug collisions by appending random 4-char suffix
- [ ] Inserts project into `projects` table via Drizzle ORM
- [ ] Returns 201 with the created project object
- [ ] Returns 409 if `githubRepoFullName` already exists in another project
- [ ] Returns 401 without valid session cookie

### GET /api/projects/:id
- [ ] Extracts `id` from route params via `await context.params`
- [ ] Validates `id` is a valid UUID format
- [ ] Returns 400 for invalid UUID format
- [ ] Queries project by ID from `projects` table
- [ ] Returns 404 when project does not exist
- [ ] Fetches latest 5 deployments for the project (ordered by `createdAt DESC`)
- [ ] Returns project object with `recentDeployments` array
- [ ] Returns 401 without valid session cookie

### PATCH /api/projects/:id
- [ ] Extracts `id` from route params
- [ ] Parses and validates body with `updateProjectSchema`
- [ ] Returns 400 with Zod error details on validation failure
- [ ] Verifies project exists, returns 404 if not
- [ ] Updates only the provided fields (partial update)
- [ ] Sets `updatedAt` to current timestamp
- [ ] Does NOT regenerate slug when name changes
- [ ] Returns the updated project object
- [ ] Returns 401 without valid session cookie

### DELETE /api/projects/:id
- [ ] Extracts `id` from route params
- [ ] Verifies project exists, returns 404 if not
- [ ] Attempts cleanup: stop active containers, release ports, remove Caddy routes
- [ ] Cleanup errors are logged but do not block deletion
- [ ] Deletes project from database (cascade deletes deployments, env vars, etc.)
- [ ] Returns `{ deleted: true }`
- [ ] Returns 401 without valid session cookie

### Slug Utility
- [ ] `slugify()` function created in `apps/dashboard/src/lib/slug.ts`
- [ ] Handles: lowercase, hyphens for spaces/special chars, no leading/trailing hyphens
- [ ] Empty input produces `"project"`
- [ ] Consecutive hyphens collapsed to single hyphen

### General
- [ ] All routes use `getDb()` singleton for database access
- [ ] No TypeScript errors
- [ ] Error responses are consistent JSON format: `{ error: string }` or `{ error: string, details: array }`

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| GET /api/projects | [ ] | |
| POST /api/projects | [ ] | |
| GET /api/projects/:id | [ ] | |
| PATCH /api/projects/:id | [ ] | |
| DELETE /api/projects/:id | [ ] | |
| Slug utility | [ ] | |
| Manual testing complete | [ ] | |
| **Step 1 Complete** | [ ] | |
