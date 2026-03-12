# Step 3: Health Check System -- Milestone Tracker

**Phase:** 5 -- Deployment Engine
**Step:** 3 of 5
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Checklist

### Implementation

- [ ] Add logger: `createLogger("health-check")`
- [ ] Add `sleep(ms)` utility function
- [ ] Implement `waitForHealthy(docker, containerId, healthCheckPath, port)`:
  - [ ] Check container is running first via `isContainerRunning()`
  - [ ] Retry loop using `HEALTH_CHECK.MAX_RETRIES` (10) and `HEALTH_CHECK.RETRY_INTERVAL_MS` (2000)
  - [ ] HTTP GET to `http://localhost:{port}{healthCheckPath}` using built-in `fetch`
  - [ ] 5-second per-request timeout via `AbortSignal.timeout(5000)`
  - [ ] Accept any 2xx response as healthy
  - [ ] Log each attempt (debug for failures, info for success)
  - [ ] Return `true` on first 2xx, `false` after all retries exhausted
  - [ ] Handle connection refused and timeout errors without throwing
- [ ] Implement `isContainerRunning(docker, containerId)`:
  - [ ] Use `docker.getContainer(containerId).inspect()`
  - [ ] Check `info.State.Running === true`
  - [ ] Return `false` on 404 (container not found)
  - [ ] Return `false` on any Docker API error
- [ ] Implement `getContainerPort(docker, containerId)`:
  - [ ] Inspect container, read `NetworkSettings.Ports`
  - [ ] Extract host port from `"3000/tcp"` binding
  - [ ] Parse host port as integer
  - [ ] Return `null` if no port mapping found or container does not exist

### Type Safety

- [ ] All functions match existing signatures in the stub
- [ ] `Dockerode` type used correctly for Docker API calls
- [ ] `HEALTH_CHECK` constants imported from `@gblockparty/shared/constants`
- [ ] `pnpm typecheck` passes with no errors

### Edge Cases

- [ ] Non-existent container ID: all functions handle gracefully
- [ ] Container that crashes mid-health-check: retry handles connection errors
- [ ] Health path without leading slash: caller responsibility (not validated here)
- [ ] Port 0 or invalid port: fetch will fail, caught by retry loop

---

## Verification

- [ ] Manual test: start a container serving HTTP, call `waitForHealthy()`, verify returns `true`
- [ ] Manual test: call `waitForHealthy()` on a container with no HTTP server, verify returns `false` after retries
- [ ] Manual test: call `isContainerRunning()` on running and stopped containers
- [ ] Manual test: call `getContainerPort()`, verify correct host port returned
- [ ] Verify log output shows attempt progression
- [ ] `pnpm typecheck` passes

---

## Notes

_Record any decisions or issues during implementation._
