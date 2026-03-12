# Phase 4 Milestone: Build System

**Phase:** 4 of 12
**Depends on:** Phase 1 (Docker + S3 on VPS), Phase 2 (Database migrations applied), Phase 3 (GitHub App installation tokens)
**Blocks:** Phase 5 (Deployment engine needs Docker images), Phase 7 (Preview builds use same pipeline), Phase 8 (Caching/streaming extend build logging)

---

## Definition of Done

All of the following must be true before this phase is complete:

### Framework Detection

- [ ] `detectFramework()` returns `{ framework: "nextjs", nextMode: "server" }` when `next.config.js` exists without `output: 'export'`
- [ ] `detectFramework()` returns `{ framework: "nextjs", nextMode: "static" }` when `next.config.js` contains `output: 'export'`
- [ ] `detectFramework()` checks all Next.js config extensions: `.js`, `.ts`, `.mjs`
- [ ] `detectFramework()` returns `{ framework: "dockerfile" }` when a `Dockerfile` is present (and no Next.js config)
- [ ] `detectFramework()` returns `{ framework: "static" }` when `index.html` is present (and no Next.js config or Dockerfile)
- [ ] `detectFramework()` throws a descriptive error when no framework can be detected
- [ ] `detectPackageManager()` returns `"pnpm"` when `pnpm-lock.yaml` exists
- [ ] `detectPackageManager()` returns `"npm"` when `package-lock.json` exists
- [ ] `detectPackageManager()` returns `"yarn"` when `yarn.lock` exists
- [ ] `detectPackageManager()` returns `"bun"` when `bun.lockb` exists
- [ ] `detectPackageManager()` defaults to `"pnpm"` when no lockfile is found

### Docker Client Operations

- [ ] `buildImage(docker, contextPath, tag, dockerfile?)` builds a Docker image from a context directory and tags it
- [ ] `buildImage()` uses a custom Dockerfile path when provided (for user-supplied Dockerfiles)
- [ ] `buildImage()` streams build output and rejects on build failure
- [ ] `runContainer(docker, image, name, port, envVars)` creates and starts a container with the given image, name, port mapping, environment variables, and `--restart=on-failure:3` policy
- [ ] `runContainer()` returns the container ID
- [ ] `stopContainer(docker, containerId, timeoutSeconds)` sends SIGTERM, waits up to `timeoutSeconds`, then SIGKILL if still running
- [ ] `getContainerLogs(docker, containerId, tail?)` returns the last N lines of container stdout+stderr
- [ ] `pruneImages(docker, projectName, keepCount)` removes old images for the project, keeping the most recent `keepCount` images
- [ ] `waitForHealthy(docker, containerId, healthCheckPath, port)` polls HTTP GET with 10 retries at 2s intervals
- [ ] `isContainerRunning(docker, containerId)` returns `true` for running containers, `false` otherwise
- [ ] `getContainerPort(docker, containerId)` returns the mapped host port from a container

### DockerProvider

- [ ] `createService(config)` creates and starts a container, returns `Service` with `id`, `containerId`, `port`, `status`
- [ ] `updateService(serviceId, config)` stops the old container and creates a new one with updated config
- [ ] `deleteService(serviceId)` stops and removes the container
- [ ] `getServiceStatus(serviceId)` returns the current container status (`running`, `stopped`, `failed`, etc.)
- [ ] `getLogs(serviceId, options)` yields log lines as an async iterable, supporting `tail` and `since` options
- [ ] `rollback(serviceId, targetDeploymentId)` starts a container from a previous image tag

### Build Pipeline (BuildRunner)

- [ ] `BuildRunner.run()` performs a shallow git clone using the installation token from Phase 3
- [ ] The clone URL uses `https://x-access-token:{token}@github.com/{owner}/{repo}.git` format
- [ ] The pipeline reads `deploy.yaml` from the repo root if present, otherwise auto-detects framework
- [ ] Build cache is restored from S3 before dependency installation
- [ ] Dependencies are installed with the detected package manager's install command
- [ ] The build command runs to completion (e.g., `pnpm build`)
- [ ] A Dockerfile is generated (or the user's Dockerfile is used) and a Docker image is built
- [ ] The image is tagged as `{projectSlug}:{commitSha}`
- [ ] Build cache is saved to S3 after a successful build
- [ ] The deployment record is updated to `status: 'deploying'` after a successful build
- [ ] The deployment record is updated to `status: 'failed'` with an error message on build failure
- [ ] Builds are killed after 15 minutes (`BUILD_LIMITS.MAX_BUILD_TIME_MS`)
- [ ] Temporary build directories are always cleaned up (success or failure)
- [ ] `BuildRunner.run()` returns `{ imageTag, durationMs }` on success

### Build Logging & S3 Storage

- [ ] Build stdout and stderr are captured in real-time during the build
- [ ] Build logs can be streamed to subscribers (for live dashboard updates)
- [ ] Completed build logs are uploaded to S3 with key `{projectId}/builds/{deploymentId}/build.log`
- [ ] The `build_log_s3_key` field on the deployment record is set after upload
- [ ] Secret values from the project's `env_vars` (where `is_secret=true`) are scrubbed from log output
- [ ] The git clone URL (containing the installation token) is scrubbed from log output
- [ ] Known secret patterns (API keys, tokens, connection strings) are replaced with `***REDACTED***`

### Build Cache

- [ ] `saveCache()` uploads a tarball to S3 with key `{projectId}/deps/{lockfileHash}` for dependencies
- [ ] `saveCache()` uploads a tarball to S3 with key `{projectId}/build/{branch}` for framework build cache
- [ ] `restoreCache()` downloads and extracts the cache tarball if it exists in S3
- [ ] `restoreCache()` returns `null` gracefully if no cache exists (first build)
- [ ] Cache is only saved when the lockfile hash changes (dependency cache) or after every successful build (framework cache)

---

## Step Completion Tracking

| Step | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Framework Detection | Not Started | `framework-detector.ts` -- filesystem checks + Next.js config parsing |
| 2 | Docker Client Operations | Not Started | `client.ts` + `container.ts` -- dockerode implementations |
| 3 | DockerProvider Implementation | Not Started | `index.ts` -- DeploymentProvider interface methods |
| 4 | Build Pipeline (BuildRunner) | Not Started | `builder.ts` -- full clone-to-image pipeline |
| 5 | Build Logging & S3 Storage | Not Started | `builder.ts` + `cache.ts` -- log capture, scrubbing, S3 storage |

---

## Verification Commands

```bash
# Type-check all packages (should pass with no errors)
pnpm typecheck

# Run tests for the build module
pnpm --filter @gblockparty/core test -- --testPathPattern=build

# Run tests for the docker provider module
pnpm --filter @gblockparty/core test -- --testPathPattern=providers/docker

# Verify framework detection on a sample Next.js repo
# (manual: clone a repo, call detectFramework, check output)

# Verify Docker image build (requires Docker daemon)
# (manual: build a test image, verify it appears in docker images)

# Verify build logs appear in S3
aws s3 ls s3://${S3_BUILD_CACHE_BUCKET}/ --recursive | grep build.log

# Verify build cache in S3
aws s3 ls s3://${S3_BUILD_CACHE_BUCKET}/ --recursive | grep deps/
```

---

## Risk Factors

| Risk | Mitigation |
|------|-----------|
| Next.js config parsing is complex (JS/TS/MJS with various export styles) | Use simple regex for `output: 'export'` detection; don't eval the config file |
| Docker build can be slow on first run (no layer cache) | S3-backed dependency cache skips fresh installs; Docker layer cache helps after first build |
| Build timeout kills long-running Next.js builds | 15-minute limit is generous; monitor actual build times and adjust if needed |
| dockerode API differences across Docker versions | Pin to Docker Engine 24+ (installed in Phase 1); test against specific version |
| S3 upload failure loses build logs | Log to local file first, then upload to S3; keep local file as fallback |
| Secret scrubbing misses novel patterns | Start with known patterns + exact env var values; add patterns as discovered |
| Large repos cause slow clones even with `--depth 1` | Shallow clone + single-branch limits download; monitor clone times |

---

## Handoff Notes

When this phase is complete, the following capabilities are available for subsequent phases:

- **Phase 5 (Deployment Engine):** Docker images exist in the local image cache, tagged as `{projectSlug}:{commitSha}`. The `DockerProvider` can create/stop/manage containers. The `Deployer` class (Phase 5) calls `DockerProvider.createService()` to start the container, then handles port allocation, Caddy routing, and health checks.
- **Phase 7 (Preview Deployments):** Preview builds use the same `BuildRunner.run()` pipeline. The only difference is the deployment type (`preview` vs `production`) and the image tag format (`{project}:pr-{n}-{sha}`).
- **Phase 8 (Caching, Streaming & Rollback):** Build caching is implemented in this phase. Phase 8 extends it with framework-specific cache optimization. Build log streaming subscribers (WebSocket) are set up in this phase; Phase 8 connects them to the dashboard WebSocket endpoint.
