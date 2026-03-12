# Step 5 Milestone: Build Logging & S3 Storage

**Phase:** 4 | **Step:** 5 of 5
**Type:** Code implementation

---

## Checklist

### BuildLogger Class

- [ ] `BuildLogger` class created with `log()`, `section()`, `subscribe()`, `getFullLog()`, `uploadToS3()` methods
- [ ] `addSecrets()` accepts an array of secret strings and creates regex patterns for scrubbing
- [ ] `subscribe()` returns an unsubscribe function
- [ ] Subscriber errors are caught and do not interrupt the build
- [ ] `getFullLog()` returns all lines joined with newlines
- [ ] `uploadToS3()` uploads to `{projectId}/builds/{deploymentId}/build.log`

### Secret Scrubbing

- [ ] `scrub()` replaces exact secret values from env_vars with `***REDACTED***`
- [ ] `scrub()` removes installation tokens from git clone URLs
- [ ] `scrubCommonPatterns()` handles AWS access keys (`AKIA...`)
- [ ] `scrubCommonPatterns()` handles API key/token/secret assignments
- [ ] `scrubCommonPatterns()` handles PostgreSQL connection string passwords
- [ ] `scrubCommonPatterns()` handles Bearer tokens
- [ ] Secrets shorter than 4 characters are not added as patterns (avoid false positives)
- [ ] Regex special characters in secret values are properly escaped

### Build Pipeline Integration

- [ ] `BuildRunner` creates a `BuildLogger` instance at the start of `run()`
- [ ] Project secrets are loaded from the `env_vars` table and added to the logger
- [ ] The installation token is added as a secret for scrubbing
- [ ] The `onLog` callback from `BuildRunnerOptions` is connected as a subscriber
- [ ] All `spawn()` stdout/stderr output is piped through `buildLogger.log()`
- [ ] Section headers are added for each pipeline step (clone, detect, cache, install, build, Docker, cache save)
- [ ] Build log is uploaded to S3 in the `finally` block (even on failure)
- [ ] The `build_log_s3_key` is saved to the deployment record after upload
- [ ] S3 upload failure does not throw (warning logged)

### Build Cache (cache.ts)

- [ ] `saveCache()` calls `uploadToS3()` with the correct key format
- [ ] `restoreCache()` calls `downloadFromS3()` with the correct key format
- [ ] `restoreCache()` returns `null` on cache miss (no throw)
- [ ] Tarball helper `createTarball()` produces a gzipped tar buffer
- [ ] Tarball helper `extractTarball()` restores a directory from a buffer
- [ ] `tar` package added to `packages/core/package.json`

### Code Quality

- [ ] `pnpm typecheck` passes with no errors
- [ ] No secrets appear in the final uploaded log file
- [ ] The log file is readable and well-formatted with section headers

---

## Scrub Verification Test Cases

| Input | Expected Output |
|-------|----------------|
| `git clone https://x-access-token:ghs_abc123@github.com/user/repo` | `git clone https://github.com/user/repo` |
| `DATABASE_URL=postgresql://admin:s3cr3t@db.example.com/mydb` | `DATABASE_URL=postgresql://***:***@db.example.com/mydb` |
| `Setting AKIAIOSFODNN7EXAMPLE in config` | `Setting ***REDACTED*** in config` |
| `Authorization: Bearer eyJhbGciOiJSUzI1NiIs...` | `Authorization: Bearer ***REDACTED***` |
| `api_key="sk_live_12345abcdef"` | `api_key=***REDACTED***` |
| `Using secret value my-project-secret` (where `my-project-secret` is in env_vars) | `Using secret value ***REDACTED***` |
| `Normal log line with no secrets` | `Normal log line with no secrets` (unchanged) |

---

## Log File Structure Verification

After a successful build, the S3 log file should contain:

```
--- Cloning repository ---
[git clone output]

--- Detecting framework ---
Framework: nextjs, Mode: server
Package manager: pnpm

--- Restoring build cache ---
[cache restore output or "No cache found"]

--- Installing dependencies ---
[pnpm install output]

--- Running build ---
[next build output]

--- Building Docker image ---
[docker build output]

--- Saving build cache ---
[cache save output]

--- Build complete ---
```

Verify:
- [ ] Each section header appears in order
- [ ] No secrets appear anywhere in the file
- [ ] The file is stored at the correct S3 key
- [ ] The deployment record's `build_log_s3_key` matches the S3 key
