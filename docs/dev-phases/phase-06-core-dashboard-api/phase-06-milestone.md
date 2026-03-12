# Phase 6 Milestone: Core Dashboard & API Routes

**Phase:** 6 of 12
**Status:** Not Started
**Target:** All API routes implemented, webhook handler complete, dashboard UI functional

---

## Milestone Checklist

### Step 1: Projects API Routes
- [ ] `GET /api/projects` returns array of all projects with latest deployment status
- [ ] `POST /api/projects` validates with `createProjectSchema`, generates slug, inserts into DB, returns created project
- [ ] `GET /api/projects/:id` returns full project detail with latest deployment info
- [ ] `PATCH /api/projects/:id` validates with `updateProjectSchema`, updates allowed fields, sets `updatedAt`
- [ ] `DELETE /api/projects/:id` deletes project and all cascaded data (deployments, env vars, etc.)
- [ ] Slug generation from project name (lowercase, hyphens, deduplication with suffix)
- [ ] 404 returned when project ID does not exist
- [ ] 400 returned with Zod error details for invalid input
- [ ] 401 returned for unauthenticated requests

### Step 2: Deployments API Routes
- [ ] `GET /api/projects/:id/deployments` returns paginated list sorted by `created_at DESC`
- [ ] Pagination via `?page=1&limit=20` query params with `{ data, total, page, limit }` response
- [ ] `POST /api/projects/:id/deployments` creates deployment record with status `queued`
- [ ] POST validates with `triggerDeploymentSchema` (branch, commitSha, type)
- [ ] POST enqueues build via `BuildQueue.enqueue()`
- [ ] `GET /api/projects/:id/deployments/:did` returns deployment detail with `buildLogS3Key` for log fetching
- [ ] 404 returned when project or deployment does not exist
- [ ] Deployment record includes: id, status, type, commitSha, branch, prNumber, url, buildDurationMs, createdAt

### Step 3: Environment Variables API Routes
- [ ] `GET /api/projects/:id/env?scope=production` returns env vars filtered by scope
- [ ] Secret values masked as `"***"` in GET responses (never returned in plaintext)
- [ ] Non-secret values returned in plaintext
- [ ] `POST /api/projects/:id/env` creates env var with Zod validation (`createEnvVarSchema`)
- [ ] POST encrypts value with AES-256-GCM (via `encrypt()`) when `isSecret: true`
- [ ] POST enforces uniqueness on `(project_id, scope, key)` -- returns 409 on conflict
- [ ] `PATCH /api/projects/:id/env/:varId` updates value and/or isSecret flag
- [ ] PATCH re-encrypts value if isSecret changes to true
- [ ] `DELETE /api/projects/:id/env/:varId` deletes the env var
- [ ] 404 returned when project or env var does not exist

### Step 4: GitHub Webhook Handler
- [ ] Payload parsed as JSON from the request body text
- [ ] Delivery ID extracted from `x-github-delivery` header
- [ ] Duplicate delivery IDs detected (database check) and return 200 without re-processing
- [ ] Push events: project looked up by `installationId` + `repoFullName`
- [ ] Push events: branch extracted from `ref` (strip `refs/heads/` prefix)
- [ ] Push events: only production branch pushes trigger deployments
- [ ] Push events: deployment record created with type `production`, status `queued`, commit SHA from `after`
- [ ] Push events: build enqueued via `BuildQueue`
- [ ] Push events: returns 200 within 500ms (build runs async)
- [ ] Pull request events: acknowledged with 200, routed to placeholder (Phase 7 TODO)
- [ ] Installation events: logged, `github_installations` table updated
- [ ] Unknown event types: logged and return 200
- [ ] Handler returns 200 for all valid-signature requests (GitHub retries on non-2xx)

### Step 5: Projects List Page UI
- [ ] Page fetches projects via `useSWR` calling `GET /api/projects`
- [ ] Projects displayed in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Each project card shows: name, GitHub repo (as link), deployment status badge, production URL
- [ ] Status badges color-coded: green (ready), yellow (building/deploying), red (failed), gray (queued)
- [ ] "Connect Repo" button visible, links to GitHub App installation URL
- [ ] Empty state shown when no projects exist ("No projects yet. Connect a GitHub repository to get started.")
- [ ] Loading state with skeleton cards while SWR fetches data
- [ ] Error state shown if API call fails

### Step 6: Project Detail Page UI
- [ ] Layout fetches project data and passes to child routes
- [ ] Tab navigation converted from static `<span>` elements to `<Link>` components with active state
- [ ] Tabs link to: Overview (`/projects/:id`), Deployments (`/projects/:id/deployments`), Environment (`/projects/:id/environment`), Settings (`/projects/:id/settings`)
- [ ] Overview shows current production URL as clickable link
- [ ] Overview shows 5 most recent deployments with status, commit SHA (truncated), branch, relative timestamp
- [ ] "Deploy" button triggers POST to deployments API
- [ ] "View Logs" button links to the latest deployment detail page
- [ ] Project name and GitHub repo shown in header

### Step 7: Deployment Detail & Build Logs Page UI
- [ ] Deployments list page shows all deployments with status badges, commit SHA, branch, timestamp, duration
- [ ] Active deployment highlighted (current production)
- [ ] Deployment detail page accessible at `/projects/:id/deployments/:deploymentId`
- [ ] Detail page shows deployment metadata: status, type, commit SHA, branch, PR number, duration, image size
- [ ] Build logs fetched from S3 via the `buildLogS3Key`
- [ ] ANSI escape codes rendered as colored HTML (using ansi-to-html or equivalent)
- [ ] Log viewer has monospace font, dark background, auto-scroll to bottom
- [ ] Loading state shown while logs are being fetched
- [ ] Error state shown if log fetch fails (e.g., log not yet available for queued builds)

### Step 8: Environment Variables Page UI
- [ ] Scope toggle between "Production" and "Preview" (styled as segmented control or tab)
- [ ] Env vars displayed as key-value rows with edit/delete actions
- [ ] Secret values displayed as `***` with a "Reveal" button (fetches actual value if non-secret, shows "hidden" for secrets)
- [ ] "Add Variable" form with key input, value textarea, secret checkbox
- [ ] Key input validates format: uppercase letters, digits, underscores only (`^[A-Z_][A-Z0-9_]*$`)
- [ ] Edit mode: inline editing of value with save/cancel
- [ ] Delete confirmation dialog before removing an env var
- [ ] Bulk edit mode: textarea for pasting KEY=VALUE lines, parses and creates multiple env vars
- [ ] Success/error toast notifications for mutations

---

## Definition of Done

Phase 6 is complete when:

1. All 12 API endpoints return correct responses for valid and invalid inputs.
2. The GitHub webhook handler processes push events end-to-end (parse, deduplicate, create deployment, enqueue build).
3. The projects list page loads and displays projects with real data from the API.
4. Project detail, deployments, and environment pages are fully interactive.
5. Build logs render with ANSI color support.
6. Environment variables can be created, edited, and deleted with proper secret handling.
7. All pages handle loading, error, and empty states.
8. No TypeScript errors (`pnpm typecheck` passes).
9. Manual testing confirms end-to-end flow: create project via API, trigger deployment, view in dashboard.

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Projects API (list, create, get, update, delete) | `apps/dashboard/src/app/api/projects/route.ts`, `apps/dashboard/src/app/api/projects/[id]/route.ts` |
| Deployments API (list, trigger, get detail) | `apps/dashboard/src/app/api/projects/[id]/deployments/route.ts`, `apps/dashboard/src/app/api/projects/[id]/deployments/[deploymentId]/route.ts` |
| Env vars API (list, create, update, delete) | `apps/dashboard/src/app/api/projects/[id]/env/route.ts`, `apps/dashboard/src/app/api/projects/[id]/env/[varId]/route.ts` |
| Webhook handler (push events) | `apps/dashboard/src/app/api/webhooks/github/route.ts` |
| Projects list page | `apps/dashboard/src/app/page.tsx` |
| Project detail page + layout | `apps/dashboard/src/app/projects/[id]/page.tsx`, `apps/dashboard/src/app/projects/[id]/layout.tsx` |
| Deployments page + detail | `apps/dashboard/src/app/projects/[id]/deployments/page.tsx`, `apps/dashboard/src/app/projects/[id]/deployments/[deploymentId]/page.tsx` |
| Environment variables page | `apps/dashboard/src/app/projects/[id]/environment/page.tsx` |
| UI components | `apps/dashboard/src/components/projects/`, `apps/dashboard/src/components/deployments/`, `apps/dashboard/src/components/env/` |
| SWR hooks | `apps/dashboard/src/hooks/` |

---

## Sign-Off

| Step | Completed | Date | Notes |
|------|-----------|------|-------|
| Step 1: Projects API Routes | [ ] | | |
| Step 2: Deployments API Routes | [ ] | | |
| Step 3: Environment Variables API Routes | [ ] | | |
| Step 4: GitHub Webhook Handler | [ ] | | |
| Step 5: Projects List Page UI | [ ] | | |
| Step 6: Project Detail Page UI | [ ] | | |
| Step 7: Deployment Detail & Build Logs Page UI | [ ] | | |
| Step 8: Environment Variables Page UI | [ ] | | |
| **Phase 6 Complete** | [ ] | | |
