# Step 3 Milestone: DockerProvider Implementation

**Phase:** 4 | **Step:** 3 of 5
**Type:** Code implementation

---

## Checklist

### createService()

- [ ] Calls `runContainer()` with the config's image, name, port, and envVars
- [ ] Calls `waitForHealthy()` with the config's healthCheckPath and port
- [ ] Returns `Service` with `status: "running"` when health check passes
- [ ] Stops the container and throws an error when health check fails
- [ ] Correctly maps `ServiceConfig` fields to Docker client parameters

### updateService()

- [ ] Creates a new container from the updated config
- [ ] Health-checks the new container before stopping the old one
- [ ] Stops the old container only after the new one is confirmed healthy
- [ ] Keeps the old container running if the new container fails health check
- [ ] Returns the new `Service` object on success

### deleteService()

- [ ] Finds the container by service ID (name)
- [ ] Stops and removes the container
- [ ] Handles missing/already-removed containers gracefully

### getServiceStatus()

- [ ] Lists containers filtered by service name
- [ ] Returns `"running"` for running containers
- [ ] Returns `"stopped"` for exited (code 0) or paused containers
- [ ] Returns `"failed"` for exited (non-zero code) or dead containers
- [ ] Returns `"starting"` for created/restarting containers
- [ ] Returns `"unknown"` when no matching container found

### getLogs()

- [ ] Finds the container by service ID
- [ ] Yields log lines from container stdout and stderr
- [ ] Supports `tail` option to limit number of lines
- [ ] Supports `since` option to filter by timestamp
- [ ] Supports `follow: true` for streaming (async iterable)
- [ ] Returns empty iterable for non-existent containers

### rollback()

- [ ] Throws a clear error directing callers to use `Deployer.rollbackDeployment()` instead
- [ ] Error message explains that the Docker provider delegates rollback to the Deployer class

### Interface Compliance

- [ ] `DockerProvider` correctly implements all methods of the `DeploymentProvider` interface
- [ ] All method signatures match the interface definition in `packages/core/src/providers/types.ts`
- [ ] `pnpm typecheck` passes with no errors

---

## Integration Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Create and verify service | `createService()` with a test image | Service is running, health check passed |
| Update service (success) | `createService()` then `updateService()` with new image | Old container stopped, new container running |
| Update service (failure) | `updateService()` with an image that fails health check | Old container still running, error thrown |
| Delete service | `createService()` then `deleteService()` | Container stopped and removed |
| Get status of running service | `createService()` then `getServiceStatus()` | Returns `"running"` |
| Get status of stopped service | `createService()`, `stopContainer()`, `getServiceStatus()` | Returns `"stopped"` |
| Get logs from service | `createService()` then `getLogs()` | Yields log lines |
| Delete non-existent service | `deleteService("nonexistent")` | No error thrown |
