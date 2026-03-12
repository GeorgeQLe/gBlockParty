# Step 5: Deployer Orchestration -- Milestone Tracker

**Phase:** 5 -- Deployment Engine
**Step:** 5 of 5
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Checklist

### `DeployOptions` Interface

- [ ] Add `type: "production" | "preview"` field
- [ ] Add `projectSlug: string` field
- [ ] Add `prNumber?: number` field (for preview URLs)
- [ ] Add `previousContainerId?: string` field
- [ ] Add `previousPort?: number` field
- [ ] Add `domain?: string` field
- [ ] Remove `envVars` from options (Deployer retrieves them internally)

### `Deployer.deploy()` Pipeline

- [ ] Step 1: Allocate port via `PortAllocator.allocate(deploymentId, type)`
- [ ] Step 2: Retrieve env vars via `getEnvVars(db, projectId, scope)`
- [ ] Step 3: Write temp .env file via `writeEnvFile(envVars, deploymentId)`
- [ ] Step 4: Start container via `runContainer(docker, imageTag, containerName, port, envVars)`
- [ ] Step 5: Health check via `waitForHealthy(docker, containerId, healthCheckPath, port)`
- [ ] Step 6: Update Caddy routing via `CaddyClient.addRoute(hostname, port)`
- [ ] Step 7: Stop old container via `stopContainer(docker, previousContainerId, 30)` (best effort)
- [ ] Step 8: Release old port via `portAllocator.release(previousPort)` (best effort)
- [ ] Step 9: Generate URL via `generateUrl()` or `generatePreviewUrl()`
- [ ] Step 10: Update deployment record: `status: "ready"`, `containerId`, `port`, `url`
- [ ] Step 11: Update project's `productionDeploymentId` (production deployments only)
- [ ] Return `{ containerId, port, url }`

### Failure Rollback (catch block)

- [ ] Stop new container if started (`newContainerId` is set)
- [ ] Release allocated port if allocated (`allocatedPort` is set)
- [ ] Update deployment record: `status: "failed"`, `errorMessage`
- [ ] Re-throw the error

### Cleanup (finally block)

- [ ] Call `cleanupEnvFile(envFilePath)` -- always runs

### Container Naming

- [ ] Container name follows `{projectSlug}-{deploymentIdPrefix}` convention
- [ ] Deployment ID prefix is first 8 characters of UUID

### Hostname Generation

- [ ] Production: `{projectSlug}.{domain}`
- [ ] Preview: `pr-{prNumber}--{projectSlug}.{domain}`
- [ ] Domain defaults to `process.env.PLATFORM_DOMAIN`

### `rollbackDeployment()` Implementation

- [ ] Look up target deployment by ID, verify it exists
- [ ] Verify target deployment has a `dockerImageTag`
- [ ] Look up project by ID, verify it exists
- [ ] Get current production deployment's `containerId` and `port`
- [ ] Create new deployment record with:
  - [ ] `type: "rollback"`
  - [ ] `status: "deploying"`
  - [ ] `commitSha` and `branch` from target deployment
  - [ ] `dockerImageTag` from target deployment
  - [ ] `sourceDeploymentId: targetDeploymentId`
- [ ] Instantiate `Deployer` with the rollback deployment options
- [ ] Call `deployer.deploy()`
- [ ] Return the new deployment ID

### Imports

- [ ] `PortAllocator` from `./port-allocator`
- [ ] `getEnvVars`, `writeEnvFile`, `cleanupEnvFile` from `./env`
- [ ] `CaddyClient` from `../routing/caddy`
- [ ] `generateUrl`, `generatePreviewUrl` from `../routing/url`
- [ ] `createDockerClient`, `runContainer`, `stopContainer` from `../providers/docker/client`
- [ ] `waitForHealthy` from `../providers/docker/container`
- [ ] `deployments`, `projects` from `@gblockparty/shared/db/schema` (or via db schema)
- [ ] `eq` from `drizzle-orm`
- [ ] `HEALTH_CHECK` from `@gblockparty/shared/constants`

### Barrel Export

- [ ] Verify `packages/core/src/deploy/index.ts` exports `Deployer` and `rollbackDeployment`

### Type Safety

- [ ] All pipeline functions called with correct types
- [ ] Error objects properly typed with `(error as Error).message`
- [ ] `pnpm typecheck` passes with no errors

### Logging

- [ ] Log structured events for each pipeline step (info level)
- [ ] Log failures with error details (error level)
- [ ] Log best-effort step failures as warnings
- [ ] Never log secret env var values

---

## Verification

### Success Path

- [ ] Deploy a Docker image end-to-end: verify port allocated, container running, Caddy route added, DB updated
- [ ] Verify app is accessible at subdomain URL after deploy
- [ ] Verify deployment record has `status: "ready"`, `containerId`, `port`, `url`
- [ ] Verify project's `productionDeploymentId` is updated (production deploy)
- [ ] Verify temp env file is deleted after deploy

### Failure Paths

- [ ] Force port allocation failure: verify deployment set to FAILED, no container started
- [ ] Force health check failure: verify new container stopped, port released, deployment FAILED
- [ ] Force Caddy failure: verify new container stopped, port released, deployment FAILED
- [ ] Force old container stop failure: verify deploy still succeeds, warning logged

### Rollback

- [ ] Deploy two versions: v1, then v2
- [ ] Rollback to v1: verify new deployment record created with type "rollback"
- [ ] Verify rollback deployment uses v1's Docker image tag
- [ ] Verify v2's container is stopped and port released
- [ ] Verify app serves v1's content at subdomain URL

### Edge Cases

- [ ] Deploy with no env vars: verify pipeline works (empty env, no file written)
- [ ] Deploy preview: verify preview URL and port range (4000-4999)
- [ ] Rollback to non-existent deployment: verify error thrown before any state changes
- [ ] Rollback to deployment with no image tag: verify error thrown

---

## Notes

_Record any decisions or issues during implementation._
