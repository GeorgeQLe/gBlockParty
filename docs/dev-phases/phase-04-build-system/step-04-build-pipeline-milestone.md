# Step 4 Milestone: Build Pipeline (BuildRunner)

**Phase:** 4 | **Step:** 4 of 5
**Type:** Code implementation

---

## Checklist

### Repository Cloning

- [ ] Obtains an installation token from `GitHubAppClient` (Phase 3)
- [ ] Constructs the authenticated clone URL (`x-access-token:{token}@github.com`)
- [ ] Runs `git clone --depth 1 --branch {branch} --single-branch`
- [ ] Checks out the specific commit SHA after clone
- [ ] Clone writes to a unique build directory (`/tmp/gblockparty/builds/{projectId}-{sha}`)

### Framework & Package Manager Detection

- [ ] Checks for `deploy.yaml` in the repo root first
- [ ] Parses `deploy.yaml` with Zod validation when present
- [ ] Falls back to `detectFramework()` (Step 1) when no `deploy.yaml` exists
- [ ] Calls `detectPackageManager()` (Step 1) to identify the package manager
- [ ] Handles detection errors gracefully (marks deployment as FAILED)

### Build Cache

- [ ] Computes lockfile hash (SHA-256, first 16 chars) for cache key
- [ ] Calls `restoreCache()` to download dependency cache from S3
- [ ] Calls `restoreCache()` to download framework build cache from S3
- [ ] Cache restore failures are non-fatal (warning logged, build continues)
- [ ] Calls `saveCache()` to upload dependency cache after successful install
- [ ] Calls `saveCache()` to upload framework build cache after successful build
- [ ] Cache save failures are non-fatal (warning logged)

### Dependency Installation

- [ ] Runs `pnpm install --frozen-lockfile` for pnpm projects
- [ ] Runs `npm ci` for npm projects
- [ ] Runs `yarn install --frozen-lockfile` for yarn projects
- [ ] Runs `bun install --frozen-lockfile` for bun projects
- [ ] Install failures are captured and mark the deployment as FAILED

### Build Execution

- [ ] Runs the framework's build command (e.g., `pnpm build`)
- [ ] Skips the build step when `buildCommand` is empty (e.g., static sites with custom Dockerfile)
- [ ] Build failures are captured and mark the deployment as FAILED

### Dockerfile Preparation

- [ ] Generates a Dockerfile for Next.js server mode using `generateDockerfile()`
- [ ] Generates a Dockerfile for Next.js static mode using `generateDockerfile()`
- [ ] Generates a Dockerfile for plain static sites using `generateDockerfile()`
- [ ] Uses the user-provided Dockerfile for `framework: "dockerfile"` (no generation)
- [ ] Throws an error if `framework: "dockerfile"` but no Dockerfile exists in the repo

### Docker Image Build

- [ ] Calls `buildImage()` from the Docker client (Step 2)
- [ ] Tags the image as `{projectSlug}:{commitSha}`
- [ ] Calls `pruneImages()` to keep only the last 10 images per project
- [ ] Image build failures are captured and mark the deployment as FAILED

### Database Updates

- [ ] Updates deployment status to `"building"` at the start
- [ ] Updates deployment status to `"deploying"` with `dockerImageTag` and `buildDurationMs` on success
- [ ] Updates deployment status to `"failed"` with `errorMessage` on failure

### Timeout & Cleanup

- [ ] Build is killed after `BUILD_LIMITS.MAX_BUILD_TIME_MS` (15 minutes)
- [ ] Child processes (git, pnpm, docker) are killed when timeout fires
- [ ] Build directory is always cleaned up in the `finally` block
- [ ] Cleanup failure is logged but does not throw

### Return Value

- [ ] Returns `{ imageTag: string, durationMs: number }` on success
- [ ] Throws an error on failure (after updating the deployment record)

### Code Quality

- [ ] `pnpm typecheck` passes with no errors
- [ ] All external command execution uses `execFile` (not `exec`) for security
- [ ] No hardcoded paths -- uses `BUILD_DIR` env var or constant
- [ ] Structured logging via Pino (`createLogger("build-runner")`)

---

## End-to-End Test Scenario

```
1. Create a deployment record (status: "queued") for a test project
2. Instantiate BuildRunner with the deployment's options
3. Call BuildRunner.run()
4. Verify:
   - Git clone completed (build directory created temporarily)
   - Framework detected correctly
   - Dependencies installed
   - Build command ran
   - Docker image built and tagged
   - Build directory cleaned up
   - Deployment record updated to "deploying" with imageTag
   - Image visible in `docker images`
   - Cache uploaded to S3 (check with aws s3 ls)
5. Run again for the same project
6. Verify:
   - Cache restored from S3 (check logs for "cache restored")
   - Build is faster due to cache
```
