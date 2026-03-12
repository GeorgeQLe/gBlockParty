# Step 5 Milestone: Preview Cleanup

**Phase:** 7 -- Preview Deployments
**Step:** 5 of 5
**Status:** Not Started

---

## Acceptance Criteria

- [ ] `cleanupPreview()` function exists at `packages/core/src/deploy/preview-cleanup.ts`
- [ ] Container stopped with 30-second graceful timeout, then removed
- [ ] Port released via `PortAllocator.release()`
- [ ] Caddy route removed for preview hostname
- [ ] Preview Docker images deleted (all `{slug}:pr-{N}-*` tags)
- [ ] Deployment record status set to `archived`
- [ ] Each cleanup step wrapped in try/catch (best-effort)
- [ ] Remaining steps execute even if one fails
- [ ] Function is idempotent (safe to call multiple times)
- [ ] Handles null `containerId` and null `port` gracefully
- [ ] Exported from `packages/core/src/deploy/index.ts`

---

## Cleanup Step Verification

| Step | Resource | Cleanup Action | Verified |
|------|----------|---------------|----------|
| 1 | Docker container | `docker stop` (30s) + `docker rm` | [ ] |
| 2 | Port allocation | `PortAllocator.release(port)` | [ ] |
| 3 | Caddy route | `CaddyClient.removeRoute(hostname)` | [ ] |
| 4 | Docker images | `docker rmi` for all `{slug}:pr-{N}-*` tags | [ ] |
| 5 | Deployment record | Status set to `archived` | [ ] |

---

## Idempotency Verification

| Resource | Second Call Behavior | Verified |
|----------|---------------------|----------|
| Container stop | Already gone, error caught | [ ] |
| Container remove | Already removed, error caught | [ ] |
| Port release | Row already deleted, no-op | [ ] |
| Caddy route remove | Route already gone, error caught | [ ] |
| Image deletion | No matching images, no-op | [ ] |
| DB status update | Already archived, no change | [ ] |

---

## Error Resilience Verification

| Failing Step | Remaining Steps Execute | Verified |
|-------------|------------------------|----------|
| Container stop fails | Port release, Caddy, images, DB all execute | [ ] |
| Port release fails | Caddy, images, DB all execute | [ ] |
| Caddy route removal fails | Images, DB all execute | [ ] |
| Image deletion fails | DB update still executes | [ ] |
| DB update fails | All previous steps already completed | [ ] |

---

## Edge Cases

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| Container already stopped | Error caught, cleanup continues | [ ] |
| Port already released | No-op, cleanup continues | [ ] |
| Caddy route already removed | Error caught, cleanup continues | [ ] |
| No Docker images found for PR | No-op, cleanup continues | [ ] |
| Deployment already archived | DB update is no-op | [ ] |
| containerId is null (build failed before container start) | Skip container stop, continue | [ ] |
| port is null (build failed before port allocation) | Skip port release, continue | [ ] |
| Multiple deployments for same PR | All non-archived deployments cleaned up | [ ] |

---

## Resource Verification After Cleanup

| Resource | Verification Command | Expected Result | Verified |
|----------|---------------------|----------------|----------|
| Container | `docker ps -a --filter name={slug}-pr-{N}` | No containers listed | [ ] |
| Port | `SELECT * FROM port_allocations WHERE port = {port}` | No rows | [ ] |
| Caddy route | `curl https://pr-{N}--{slug}.{domain}` | 502 or connection refused | [ ] |
| Docker images | `docker images --filter reference={slug}:pr-{N}-*` | No images listed | [ ] |
| Deployment status | `SELECT status FROM deployments WHERE id = ?` | `archived` | [ ] |

---

## Image Retention Verification

- [ ] Preview images are NOT counted toward the 10-image per project retention limit
- [ ] After cleanup, `docker images {slug}` only shows production images
- [ ] The 10-image retention pruning job (daily cron) excludes archived preview deployments

---

## Unit Test Results

| Test | Result | Notes |
|------|--------|-------|
| All cleanup steps called in order | _PASS/FAIL_ | |
| Continues if container stop fails | _PASS/FAIL_ | |
| Continues if port release fails | _PASS/FAIL_ | |
| Continues if Caddy removal fails | _PASS/FAIL_ | |
| Handles null containerId | _PASS/FAIL_ | |
| Handles null port | _PASS/FAIL_ | |
| Idempotent (second call succeeds) | _PASS/FAIL_ | |

---

## Integration Test Results

| Test | Result | Notes |
|------|--------|-------|
| Running preview fully cleaned up | _PASS/FAIL_ | |
| Cleanup after partial failure | _PASS/FAIL_ | |
| Double cleanup (idempotency) | _PASS/FAIL_ | |

---

## Manual Verification Results

| Check | Result | Notes |
|-------|--------|-------|
| PR closed -> container stopped | _PASS/FAIL_ | `docker ps` |
| PR closed -> port freed | _PASS/FAIL_ | DB query |
| PR closed -> URL inaccessible | _PASS/FAIL_ | `curl` |
| PR closed -> images deleted | _PASS/FAIL_ | `docker images` |
| PR closed -> deployment archived | _PASS/FAIL_ | DB query |
| PR reopened -> new preview works | _PASS/FAIL_ | (optional) |

---

## Sign-Off

| Criteria | Met | Notes |
|----------|-----|-------|
| All 5 cleanup steps implemented | [ ] | |
| Best-effort execution (no early abort) | [ ] | |
| Idempotent (safe to call multiple times) | [ ] | |
| Null-safe for optional fields | [ ] | |
| Unit tests pass | [ ] | |
| Manual verification complete | [ ] | |
| **Step 5 Complete** | [ ] | |
