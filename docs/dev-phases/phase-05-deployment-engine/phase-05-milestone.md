# Phase 5: Deployment Engine -- Milestone Tracker

**Phase:** 5 of 12
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | Port Allocator | Not Started | `packages/core/src/deploy/port-allocator.ts` |
| 2 | Caddy Dynamic Routing Client | Not Started | `packages/core/src/routing/caddy.ts` |
| 3 | Health Check System | Not Started | `packages/core/src/providers/docker/container.ts` |
| 4 | Environment Variable Injection | Not Started | Env retrieval, decryption, temp .env file, cleanup |
| 5 | Deployer Orchestration | Not Started | `packages/core/src/deploy/deployer.ts` + `rollback.ts` |

---

## Step 1: Port Allocator

**File:** `packages/core/src/deploy/port-allocator.ts`
**Status:** Not Started

- [ ] Implement `allocate(deploymentId, type)` -- find next free port in range, insert into DB
- [ ] Implement `release(port)` -- delete from `port_allocations` table
- [ ] Implement `getUsedPorts()` -- query all currently allocated ports
- [ ] Handle edge case: no ports available (throw descriptive error)
- [ ] Use database transaction to prevent race conditions on concurrent allocations
- [ ] Verify port ranges match `PORT_RANGES` constants (production: 3001-3999, preview: 4000-4999)
- [ ] Test: allocate returns different ports for consecutive calls
- [ ] Test: release makes port available for re-allocation
- [ ] Test: allocate throws when range is exhausted

---

## Step 2: Caddy Dynamic Routing Client

**File:** `packages/core/src/routing/caddy.ts`
**Status:** Not Started

- [ ] Implement `addRoute(hostname, upstreamPort)` -- POST to Caddy admin API
- [ ] Implement `removeRoute(hostname)` -- remove specific route from Caddy config
- [ ] Implement `reloadConfig()` -- POST full config to `/load` endpoint
- [ ] Build Caddy config JSON structure with `reverse_proxy` handler
- [ ] Handle Caddy admin API errors (non-2xx responses)
- [ ] Add retry logic for transient failures (3 attempts with backoff)
- [ ] Verify admin URL is configurable via constructor / `CADDY_ADMIN_URL` env var
- [ ] Test: addRoute followed by HTTP request to hostname reaches upstream port
- [ ] Test: removeRoute makes hostname unreachable
- [ ] Test: addRoute for existing hostname updates the upstream port

---

## Step 3: Health Check System

**File:** `packages/core/src/providers/docker/container.ts`
**Status:** Not Started

- [ ] Implement `waitForHealthy(docker, containerId, healthCheckPath, port)` -- poll with retries
- [ ] Use `HEALTH_CHECK.MAX_RETRIES` (10) and `HEALTH_CHECK.RETRY_INTERVAL_MS` (2000)
- [ ] HTTP GET to `http://localhost:{port}{healthCheckPath}` -- accept any 2xx as healthy
- [ ] Implement `isContainerRunning(docker, containerId)` -- inspect container state
- [ ] Implement `getContainerPort(docker, containerId)` -- extract mapped host port
- [ ] Handle connection refused errors during early retries (container still starting)
- [ ] Log each retry attempt with attempt number and response status
- [ ] Test: healthy container returns true before max retries
- [ ] Test: unhealthy container returns false after exhausting retries
- [ ] Test: isContainerRunning returns correct state for running/stopped containers

---

## Step 4: Environment Variable Injection

**Status:** Not Started

- [ ] Query `env_vars` table by `projectId` and `scope` (production or preview)
- [ ] Decrypt secret values using `decrypt()` from `@gblockparty/shared/backend`
- [ ] Write temporary `.env` file with `KEY=VALUE` format
- [ ] Identify `NEXT_PUBLIC_*` variables for build-time handling
- [ ] Pass env file path to `docker run --env-file`
- [ ] Delete temp `.env` file after container starts (in finally block)
- [ ] Handle empty env vars (no .env file needed, skip --env-file)
- [ ] Scrub secret values from log output
- [ ] Test: env vars appear inside running container
- [ ] Test: temp file is cleaned up even on failure
- [ ] Test: secrets are decrypted correctly before injection

---

## Step 5: Deployer Orchestration

**Files:** `packages/core/src/deploy/deployer.ts`, `packages/core/src/deploy/rollback.ts`
**Status:** Not Started

### Deployer.deploy()

- [ ] Step 1: Allocate port via `PortAllocator.allocate()`
- [ ] Step 2: Retrieve and write env vars to temp file
- [ ] Step 3: Start container via `runContainer()` with image tag, port, env file
- [ ] Step 4: Health check via `waitForHealthy()`
- [ ] Step 5: Update Caddy routing via `CaddyClient.addRoute()`
- [ ] Step 6: Stop old container via `stopContainer()`
- [ ] Step 7: Update deployment record (status=READY, containerId, port, url)
- [ ] Step 8: Cleanup temp env file
- [ ] Handle failure at each step with proper rollback:
  - [ ] Port allocated but container fails -> release port
  - [ ] Container started but health check fails -> stop container, release port
  - [ ] Health check passes but Caddy fails -> stop container, release port
- [ ] Update deployment to `status: 'failed'` with `errorMessage` on any failure
- [ ] Log structured events for each pipeline step

### rollbackDeployment()

- [ ] Look up target deployment's `dockerImageTag`
- [ ] Create new deployment record with `type: 'rollback'` and `sourceDeploymentId`
- [ ] Run the deploy pipeline with the old image tag
- [ ] Update `projects.productionDeploymentId` to the new deployment
- [ ] Return the new deployment ID

---

## Completion Checklist

- [ ] All 5 steps completed and individually verified
- [ ] `Deployer.deploy()` runs the full pipeline end-to-end
- [ ] A test app can be deployed and accessed at its subdomain URL
- [ ] Rollback to a previous deployment works
- [ ] Failed deployments are properly cleaned up (port released, container stopped)
- [ ] Environment variables (including secrets) are injected correctly
- [ ] Caddy routes are added and removed without restart
- [ ] All deployment state is persisted to the database
- [ ] `pnpm typecheck` passes with no errors in `packages/core`
- [ ] Phase 5 spec acceptance criteria all satisfied

---

## Notes

_Use this section to record decisions, blockers, or deviations during implementation._
