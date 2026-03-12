# Step 4 Milestone: Backend Service Deployment

**Phase:** 11 | **Step:** 4 of 4
**Type:** Backend implementation

---

## Checklist

### Dockerfile Service Build
- [ ] `type: dockerfile` recognized in both deploy.yaml and auto-detection
- [ ] Dockerfile path resolved: `{servicePath}/{service.dockerfile}` (default: `Dockerfile`)
- [ ] Dockerfile existence validated before build starts
- [ ] Missing Dockerfile throws descriptive error with expected path
- [ ] Build command: `docker build -f {dockerfilePath} -t {imageTag} {contextPath}`
- [ ] Build context is the service directory (not repo root)
- [ ] Build timeout respects `BUILD_LIMITS.MAX_BUILD_TIME_MS` (15 minutes)
- [ ] Docker layer cache used for subsequent builds (no S3 dependency cache)

### Custom Port Support
- [ ] `deploy.yaml` `port` field read for dockerfile services
- [ ] Container port mapping: `-p {hostPort}:{servicePort}` (not hardcoded 3000)
- [ ] Default port: 3000 when not specified
- [ ] Port mapping works for non-standard ports (8080, 4000, etc.)

### Custom Health Check
- [ ] `deploy.yaml` `healthCheck.path` field read for dockerfile services
- [ ] `waitForHealthy()` called with custom path (e.g., `/health`)
- [ ] Default health check path: `/` when not specified
- [ ] Health check succeeds for backend service on custom port + path

### Framework Detection Fallback
- [ ] `detectFramework()` updated to check for `Dockerfile` at repo root
- [ ] Dockerfile at root without deploy.yaml -> `type: dockerfile`
- [ ] Default port 3000 and health check path `/` applied for auto-detected Dockerfile
- [ ] Detection order: next.config -> Dockerfile -> index.html -> error

### Deployer Integration
- [ ] `servicePort` passed through to container run command
- [ ] `healthCheckPath` passed through to health check
- [ ] Container starts and responds on the configured port
- [ ] Caddy routes hostname to the correct host port

### Backward Compatibility
- [ ] `type: nextjs` services still auto-generate Dockerfiles
- [ ] `type: static` services still auto-generate Dockerfiles
- [ ] Single-service projects without deploy.yaml still work
- [ ] No changes to existing API route contracts

### Resource Limits (Optional)
- [ ] `resources.memory` passed as `--memory` flag to `docker run`
- [ ] Flag omitted when `resources` not specified

### Tests
- [ ] Dockerfile service builds with user-provided Dockerfile
- [ ] Custom port (e.g., 8080) correctly mapped
- [ ] Custom health check path (e.g., `/health`) used
- [ ] Missing Dockerfile throws descriptive error
- [ ] Auto-detection finds Dockerfile when no deploy.yaml
- [ ] No regressions for nextjs/static services

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/build/builder.ts` | Modify (add dockerfile build path) |
| `packages/core/src/build/framework-detector.ts` | Modify (add Dockerfile detection) |
| `packages/core/src/deploy/deployer.ts` | Modify (configurable port mapping) |
| `packages/core/src/providers/docker/client.ts` | Modify (accept Dockerfile path in buildImage) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| User Dockerfile with `COPY ../` breaks with service directory as context | Document limitation; recommend multi-stage builds for monorepo shared packages |
| User Dockerfile expects specific base images not cached on VPS | First build will be slow; subsequent builds use Docker layer cache |
| User Dockerfile exposes multiple ports | Platform maps only the configured port; document single-port requirement |
