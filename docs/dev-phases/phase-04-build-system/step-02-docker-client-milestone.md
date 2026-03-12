# Step 2 Milestone: Docker Client Operations

**Phase:** 4 | **Step:** 2 of 5
**Type:** Code implementation (requires Docker daemon for testing)

---

## Checklist

### buildImage()

- [ ] Packs the context directory into a tar stream
- [ ] Calls `docker.buildImage()` with the tar stream and tag
- [ ] Supports custom Dockerfile path via the `dockerfile` parameter
- [ ] Follows the build progress stream to completion
- [ ] Rejects the promise if the build output contains an error message
- [ ] Resolves the promise when the build completes successfully

### runContainer()

- [ ] Creates a container with the specified image, name, and environment variables
- [ ] Maps the host port to the container's internal port (3000)
- [ ] Sets restart policy to `on-failure` with max 3 retries
- [ ] Starts the container after creation
- [ ] Returns the container ID string

### stopContainer()

- [ ] Sends SIGTERM to the container via `container.stop({ t: timeoutSeconds })`
- [ ] Handles already-stopped containers gracefully (no throw)
- [ ] Removes the container after stopping via `container.remove({ force: true })`
- [ ] Handles already-removed containers gracefully (no throw)

### getContainerLogs()

- [ ] Fetches stdout and stderr from the container
- [ ] Respects the `tail` parameter (defaults to 100 lines)
- [ ] Returns the log output as a UTF-8 string

### pruneImages()

- [ ] Lists all Docker images
- [ ] Filters to images matching `{projectName}:*` tag pattern
- [ ] Sorts by creation date (newest first)
- [ ] Removes images beyond the `keepCount` threshold
- [ ] Handles removal errors gracefully (image in use by running container)

### container.ts -- waitForHealthy()

- [ ] Polls `http://localhost:{port}{healthCheckPath}` with HTTP GET
- [ ] Checks if container is still running before each attempt
- [ ] Returns `true` on first 2xx response
- [ ] Returns `false` after `HEALTH_CHECK.MAX_RETRIES` (10) failed attempts
- [ ] Waits `HEALTH_CHECK.RETRY_INTERVAL_MS` (2000ms) between retries

### container.ts -- isContainerRunning()

- [ ] Inspects the container via `container.inspect()`
- [ ] Returns `info.State.Running` boolean
- [ ] Returns `false` if the container does not exist (catches error)

### container.ts -- getContainerPort()

- [ ] Inspects the container's network settings
- [ ] Extracts the host port from `PortBindings` or `Ports`
- [ ] Returns the port as a number
- [ ] Returns `null` if no port mapping exists

### Dependencies

- [ ] `tar-fs` package added to `packages/core/package.json` (if needed for `buildImage`)
- [ ] `@types/tar-fs` added to devDependencies (if needed)
- [ ] `pnpm typecheck` passes with no errors

---

## Manual Testing Procedure

These operations require a running Docker daemon. Test in this order:

```bash
# 1. Build a test image
# Create a temp directory with a minimal Dockerfile
mkdir -p /tmp/test-docker-build
echo 'FROM node:20-alpine\nCMD ["node", "-e", "require(\"http\").createServer((_, r) => r.end(\"ok\")).listen(3000)"]' > /tmp/test-docker-build/Dockerfile

# 2. Verify image appears after buildImage()
docker images | grep test-build

# 3. Verify container starts after runContainer()
docker ps | grep test-container

# 4. Verify health check passes
curl http://localhost:{assigned-port}/

# 5. Verify logs
docker logs test-container

# 6. Verify stop + remove
docker ps -a | grep test-container  # should not appear

# 7. Verify prune keeps correct count
docker images | grep test-build
```
