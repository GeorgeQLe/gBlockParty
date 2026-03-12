# Phase 7 Milestone: Preview Deployments

**Phase:** 7 of 12
**Status:** Not Started
**Target:** Every PR gets a live preview URL, with commit status checks and bot comments

---

## Definition of Done

Phase 7 is complete when every pull request on a connected repository automatically receives a preview deployment with a unique URL, GitHub commit status checks, and a bot comment -- and the preview is fully cleaned up when the PR is closed or merged.

---

## Milestone Checklist

### Step 1: PR Webhook Handler
- [ ] `handleWebhook()` in `packages/core/src/github/webhooks.ts` handles `pull_request` events
- [ ] PR `opened` action creates a deployment record with `type='preview'` and `pr_number` set
- [ ] PR `synchronize` action (new commits pushed) creates a new preview deployment record
- [ ] PR `reopened` action creates a preview deployment record
- [ ] PR `closed` action triggers preview cleanup (delegates to cleanup function)
- [ ] Project lookup by `installationId` + `repoFullName` works correctly
- [ ] Unrecognized PR actions are logged and ignored (no error)
- [ ] Webhook returns 200 within 500ms (build is async)
- [ ] Delivery ID deduplication prevents duplicate processing

### Step 2: Preview Deployment Pipeline
- [ ] `PreviewDeployer` class (or equivalent) in `packages/core/src/deploy/` handles preview-specific deployment
- [ ] Docker image built and tagged as `{project}:pr-{N}-{sha}` (short SHA, 7 characters)
- [ ] Port allocated from preview range (4000-4999) using `PortAllocator.allocate(deploymentId, 'preview')`
- [ ] Container started with preview-scope environment variables (`scope='preview'`)
- [ ] Health check passes before routing traffic (10 retries, 2s interval)
- [ ] Caddy route added: `pr-{N}--{slug}.{domain}` -> `localhost:{port}`
- [ ] Deployment record updated: `status='ready'`, `url` set, `port` set, `container_id` set, `docker_image_tag` set
- [ ] On build failure: deployment record updated to `status='failed'`, `error_message` set
- [ ] Previous preview container for same PR is stopped before new one is routed (blue-green style)
- [ ] Build duration recorded in `build_duration_ms` on deployment record

### Step 3: GitHub Commit Status Integration
- [ ] `setCommitStatus()` in `packages/core/src/github/commit-status.ts` calls `octokit.repos.createCommitStatus()`
- [ ] Status set to `pending` at build start with description "Preview deployment building..."
- [ ] Status set to `success` on successful deployment with `target_url` set to preview URL
- [ ] Status set to `failure` on build/deploy failure with description explaining the error
- [ ] Context string is `gblockparty/preview` (consistent across all status updates for the same commit)
- [ ] Status uses installation-scoped Octokit (not user token)
- [ ] Errors in status setting are logged but do not fail the deployment

### Step 4: PR Bot Comment Management
- [ ] `createOrUpdatePRComment()` in `packages/core/src/github/pr-commenter.ts` is fully implemented
- [ ] Searches for existing comment containing `BOT_COMMENT_MARKER` (`<!-- gblockparty-bot -->`)
- [ ] If existing comment found: updates it with new content via `octokit.issues.updateComment()`
- [ ] If no existing comment: creates new comment via `octokit.issues.createComment()`
- [ ] Comment body uses `formatDeploymentComment()` (already implemented)
- [ ] Comment includes preview URL, build status, and build duration
- [ ] On build failure: comment is updated to show failure status (no URL)
- [ ] Only one bot comment per PR (no duplicates)
- [ ] Uses installation-scoped Octokit
- [ ] Errors in comment posting are logged but do not fail the deployment

### Step 5: Preview Cleanup
- [ ] Cleanup triggered when PR is closed (both merged and unmerged)
- [ ] Preview container is stopped (`docker stop` with 30s graceful timeout)
- [ ] Port is released via `PortAllocator.release(port)`
- [ ] Caddy route is removed via `CaddyClient.removeRoute(hostname)`
- [ ] Preview Docker images for the PR are deleted (`docker rmi` for all `{project}:pr-{N}-*` tags)
- [ ] Deployment record status updated to `archived`
- [ ] Preview images are NOT counted toward the 10-image per project retention limit
- [ ] Cleanup handles missing containers gracefully (already stopped/removed)
- [ ] Cleanup handles missing ports gracefully (already released)
- [ ] Cleanup handles missing routes gracefully (already removed)

---

## Code Review Criteria

### Webhook Handler
- [ ] All PR action types are explicitly handled or logged (no silent drops)
- [ ] Error in one webhook does not affect processing of subsequent webhooks
- [ ] Async build is properly dispatched (not awaited in webhook response path)
- [ ] Database transaction used for deployment record creation + status update

### Preview Pipeline
- [ ] Image tag format is deterministic: `{project}:pr-{N}-{sha7}`
- [ ] Port allocation failure results in deployment failure (not silent hang)
- [ ] Container start failure results in port being released (cleanup on failure)
- [ ] Health check failure results in container being stopped and port released
- [ ] Caddy route points to correct preview hostname format: `pr-{N}--{slug}.{domain}`
- [ ] Environment variables loaded from `env_vars` table with `scope='preview'`

### GitHub API Integration
- [ ] All GitHub API calls use try/catch with structured logging
- [ ] GitHub API errors do not cause the preview deployment to fail
- [ ] Rate limit headers are respected (log warnings at 80% usage)
- [ ] Installation token is obtained fresh for each operation (via cached `getInstallationOctokit()`)

### Cleanup
- [ ] Cleanup is idempotent (safe to run multiple times for the same PR)
- [ ] All resources are released even if individual cleanup steps fail (best-effort for each)
- [ ] Docker image deletion uses the PR-specific tag pattern, not wildcard
- [ ] No orphaned ports, containers, or routes after cleanup

---

## Test Requirements

### Automated Tests

#### Unit Tests
- [ ] `handleWebhook()` with pull_request opened: creates deployment record
- [ ] `handleWebhook()` with pull_request synchronize: creates new deployment, identifies old one
- [ ] `handleWebhook()` with pull_request closed: triggers cleanup for correct PR
- [ ] `handleWebhook()` with pull_request closed (merged=true): same cleanup behavior
- [ ] `PreviewDeployer` success path: port allocated, container started, Caddy route added, record updated
- [ ] `PreviewDeployer` build failure: record set to failed, no port allocated, no route added
- [ ] `PreviewDeployer` health check failure: container stopped, port released, record set to failed
- [ ] `setCommitStatus()` builds correct API payload for each state
- [ ] `createOrUpdatePRComment()` finds existing comment and updates it
- [ ] `createOrUpdatePRComment()` creates new comment when none exists
- [ ] `cleanupPreview()` calls stop, release, removeRoute, rmi, archive in correct order
- [ ] `cleanupPreview()` continues cleanup even if one step fails

#### Integration Tests
- [ ] Full webhook-to-deployment flow: PR opened -> deployment record created -> build triggered
- [ ] Full cleanup flow: PR closed -> container stopped -> port released -> route removed -> images deleted -> archived
- [ ] Port allocation returns port in 4000-4999 range for preview type
- [ ] Port is not re-allocated while still in use by active preview

### Manual Verification
- [ ] Open a PR on a connected repo
- [ ] Verify preview URL is accessible at `pr-{N}--{slug}.yourdomain.dev`
- [ ] Check GitHub commit for status check (green checkmark with link)
- [ ] Check PR for bot comment with preview URL
- [ ] Push a new commit to the PR branch
- [ ] Verify preview updates (new content, same URL)
- [ ] Verify bot comment is updated (not duplicated)
- [ ] Verify new commit has status check
- [ ] Close (or merge) the PR
- [ ] Verify preview URL returns 502/404 (route removed)
- [ ] Verify container is stopped (`docker ps` does not show it)
- [ ] Verify port is released (available for next preview)
- [ ] Verify preview images are deleted (`docker images | grep pr-{N}` returns nothing)

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Updated webhook handler | `packages/core/src/github/webhooks.ts` |
| Preview deployer | `packages/core/src/deploy/preview-deployer.ts` (new) |
| Commit status implementation | `packages/core/src/github/commit-status.ts` |
| PR comment implementation | `packages/core/src/github/pr-commenter.ts` |
| Preview cleanup function | `packages/core/src/deploy/preview-cleanup.ts` (new) |
| Unit tests | `packages/core/src/__tests__/` |

---

## Sign-Off

| Step | Completed | Date | Notes |
|------|-----------|------|-------|
| Step 1: PR Webhook Handler | [ ] | | |
| Step 2: Preview Deployment Pipeline | [ ] | | |
| Step 3: Commit Status Integration | [ ] | | |
| Step 4: PR Bot Comment Management | [ ] | | |
| Step 5: Preview Cleanup | [ ] | | |
| **Phase 7 Complete** | [ ] | | |
