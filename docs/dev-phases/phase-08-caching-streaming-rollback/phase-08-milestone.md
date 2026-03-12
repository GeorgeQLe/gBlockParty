# Phase 8 Milestone: Build Caching, Log Streaming & Rollback

**Phase:** 8
**Status:** Not Started
**Target:** Builds use S3 caching, logs stream in real-time, rollback works, crash-loop auto-rollback enabled, images pruned

---

## Milestone Checklist

### Step 1: S3 Dependency Cache
- [ ] `saveCache()` implemented -- creates tarball of `node_modules/`, uploads to S3 at `{projectId}/deps/{lockfileHash}`
- [ ] `restoreCache()` implemented -- downloads tarball from S3 (if exists), extracts to `node_modules/`
- [ ] Cache key is SHA-256 hash of `pnpm-lock.yaml`
- [ ] Cache is only saved when lockfile has changed (new hash vs. previous build)
- [ ] Cache miss (no matching key) falls through gracefully -- `pnpm install` runs normally
- [ ] Cache hit skips or accelerates `pnpm install` (lockfile unchanged means node_modules is already correct)
- [ ] Tarball size is validated against `BUILD_LIMITS.BUILD_CACHE_SIZE_BYTES` (1 GB) before upload
- [ ] `BuildRunner.run()` calls `restoreCache()` before install and `saveCache()` after successful install
- [ ] Verified: second build with same lockfile is measurably faster

### Step 2: S3 Framework Build Cache
- [ ] Framework cache (`.next/cache/`) saved to S3 at `{projectId}/build/{branch}` after successful build
- [ ] Framework cache restored before build command runs
- [ ] Cache is per-branch (production and preview branches have separate caches)
- [ ] S3 lifecycle rule configured for 7-day expiry on `{projectId}/build/` prefix
- [ ] `BuildRunner.run()` calls restore before build and save after build for framework cache
- [ ] Verified: incremental Next.js build with framework cache is faster than cold build

### Step 3: WebSocket Log Streaming
- [ ] SSE endpoint at `/api/projects/[id]/deployments/[deploymentId]/logs/stream` streams build output
- [ ] `BuildRunner` emits log events (via EventEmitter, callback, or shared channel) as build produces output
- [ ] SSE endpoint subscribes to log events for the specified deployment and pushes them to the client
- [ ] Each SSE event includes an event ID for resume support via `Last-Event-ID`
- [ ] Stream closes when build completes (success or failure)
- [ ] After build completes, full log is uploaded to S3 at the deployment's `build_log_s3_key`
- [ ] Authentication enforced on the SSE endpoint (session check)
- [ ] Verified: dashboard shows build output line-by-line in real-time

### Step 4: Build Log Retrieval
- [ ] GET `/api/projects/[id]/deployments/[deploymentId]/logs` fetches logs from S3
- [ ] Response includes raw log text with ANSI color codes preserved
- [ ] Returns 404 if no logs exist for the deployment (build not yet complete or never started)
- [ ] Returns 200 with log content as `text/plain` or JSON with content field
- [ ] Authentication enforced via `withAuth` wrapper
- [ ] Verified: completed build logs retrievable from dashboard

### Step 5: Rollback Mechanism
- [ ] `rollbackDeployment(db, projectId, targetDeploymentId)` implemented in `packages/core/src/deploy/rollback.ts`
- [ ] Fetches target deployment record and validates it has a `docker_image_tag`
- [ ] Validates target image still exists in Docker (not pruned)
- [ ] Creates new deployment record with `type: 'rollback'`, `source_deployment_id` set
- [ ] Allocates port and starts container from the target deployment's image
- [ ] Runs health check (10 retries, 2s interval) before routing traffic
- [ ] Updates Caddy to route to the new container
- [ ] Stops the currently-running production container
- [ ] Updates `projects.production_deployment_id` to the new rollback deployment
- [ ] Returns the new deployment ID
- [ ] Verified: rollback restores a previous version and serves it at the production URL

### Step 6: Rollback API & Dashboard UI
- [ ] POST `/api/projects/:id/deployments/:did/rollback` calls `rollbackDeployment()`
- [ ] Endpoint validates the deployment belongs to the project
- [ ] Endpoint validates the deployment type is `production` or `rollback` (cannot rollback to a preview)
- [ ] Returns new deployment ID and URL on success
- [ ] Returns appropriate error codes (404 deployment not found, 409 rollback already in progress, 422 image pruned)
- [ ] Dashboard deployment list shows "Rollback to this version" button per deployment
- [ ] Currently active deployment is visually indicated (badge or highlight)
- [ ] Rollback button opens a confirmation dialog before proceeding
- [ ] Rollback in progress shows a loading/pending state
- [ ] Deployment list shows rollback entries with link to the source deployment
- [ ] Verified: end-to-end rollback from dashboard UI

### Step 7: Auto-Rollback on Crash-Loop
- [ ] Container crash monitoring implemented (Docker events or restart count polling)
- [ ] Crash-loop detected when container restarts 3+ times in 5 minutes (`HEALTH_CHECK.CRASH_THRESHOLD`, `HEALTH_CHECK.CRASH_WINDOW_MS`)
- [ ] Only counts non-zero exit code restarts (not graceful restarts or manual stops)
- [ ] On crash-loop detection: stop the crashing container
- [ ] Auto-rollback triggers `rollbackDeployment()` to the previous production deployment
- [ ] Deployment record for the crashed deployment updated to `status: 'failed'`, `error_message: 'crash-loop-detected'`
- [ ] Slack/Discord notification sent with deployment details and crash reason
- [ ] Auto-rollback does not trigger if there is no previous healthy deployment to rollback to
- [ ] Verified: container that exits immediately triggers auto-rollback

### Step 8: Docker Image Retention & Cleanup
- [ ] `pruneImages(docker, projectName, keepCount)` implemented in `packages/core/src/providers/docker/client.ts`
- [ ] Lists all images for the project, sorted by creation date
- [ ] Keeps the most recent `keepCount` images (default: `BUILD_LIMITS.MAX_IMAGES_PER_PROJECT` = 10)
- [ ] Removes older images via Docker API
- [ ] Preview images (tagged `pr-{N}-{sha}`) deleted when PR is closed (not counted toward retention limit)
- [ ] Pruning called after each successful production deploy
- [ ] Pruning skips images currently in use by running containers
- [ ] Verified: after 11th deploy, oldest image is removed; only 10 retained

---

## Definition of Done

Phase 8 is complete when:

1. Dependency caching via S3 measurably speeds up builds with unchanged lockfiles.
2. Framework build caching via S3 speeds up incremental Next.js builds.
3. Build logs stream in real-time to the dashboard while builds are in progress.
4. Completed build logs are stored in S3 and retrievable via the API.
5. Rollback works end-to-end: API call -> container start -> health check -> Caddy update -> old container stop.
6. The dashboard has a rollback UI with confirmation dialog and active deployment indicator.
7. Crash-looping containers auto-rollback to the previous healthy deployment with notification.
8. Docker images are pruned to the configured retention limit after each deploy.

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Dependency cache implementation | `packages/core/src/build/cache.ts` |
| Framework cache implementation | `packages/core/src/build/cache.ts` |
| Build pipeline cache integration | `packages/core/src/build/builder.ts` |
| SSE log streaming endpoint | `apps/dashboard/src/app/api/projects/[id]/deployments/[deploymentId]/logs/stream/route.ts` |
| Build log retrieval endpoint | `apps/dashboard/src/app/api/projects/[id]/deployments/[deploymentId]/logs/route.ts` |
| Rollback mechanism | `packages/core/src/deploy/rollback.ts` |
| Rollback API endpoint | `apps/dashboard/src/app/api/projects/[id]/deployments/[deploymentId]/rollback/route.ts` |
| Rollback dashboard UI | `apps/dashboard/src/app/projects/[id]/deployments/` (page components) |
| Crash-loop monitor | `packages/core/src/deploy/` (new monitoring module) |
| Image pruning | `packages/core/src/providers/docker/client.ts` |

---

## Sign-Off

| Step | Completed | Date | Notes |
|------|-----------|------|-------|
| Step 1: S3 Dependency Cache | [ ] | | |
| Step 2: S3 Framework Build Cache | [ ] | | |
| Step 3: WebSocket Log Streaming | [ ] | | |
| Step 4: Build Log Retrieval | [ ] | | |
| Step 5: Rollback Mechanism | [ ] | | |
| Step 6: Rollback API & Dashboard UI | [ ] | | |
| Step 7: Auto-Rollback on Crash-Loop | [ ] | | |
| Step 8: Docker Image Retention & Cleanup | [ ] | | |
| **Phase 8 Complete** | [ ] | | |
