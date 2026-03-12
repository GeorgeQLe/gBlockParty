# Step 4: Environment Variable Injection -- Milestone Tracker

**Phase:** 5 -- Deployment Engine
**Step:** 4 of 5
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Checklist

### New File: `packages/core/src/deploy/env.ts`

- [ ] Create `packages/core/src/deploy/env.ts`
- [ ] Add logger: `createLogger("env-injection")`
- [ ] Add required imports: Drizzle schema, encryption, fs/promises, path

### `getEnvVars(db, projectId, scope)`

- [ ] Query `env_vars` table filtered by `projectId` and `scope`
- [ ] Iterate rows: decrypt value if `isSecret === true`, use as-is if `false`
- [ ] Build `Record<string, string>` mapping key -> decrypted/plain value
- [ ] Return empty object if no rows found
- [ ] Log: count of vars retrieved, count of secrets (keys only, never values)

### `writeEnvFile(envVars, deploymentId)`

- [ ] Return empty string if `envVars` is empty (skip file creation)
- [ ] Build `KEY=VALUE` lines with proper escaping:
  - [ ] Escape newlines (`\n` -> `\\n`)
  - [ ] Escape double quotes
  - [ ] Wrap values containing spaces, newlines, or quotes in double quotes
- [ ] Create `.tmp/env/` directory with `mkdir({ recursive: true })`
- [ ] Write to `.tmp/env/.env.{deploymentId}`
- [ ] Set file permissions to `0o600` (owner read/write only)
- [ ] Return the file path
- [ ] Log: file path, deployment ID, var count

### `cleanupEnvFile(filePath)`

- [ ] Guard: if filePath is empty string, return immediately
- [ ] `unlink(filePath)` wrapped in try/catch
- [ ] On success: log debug
- [ ] On error: log warning, do not throw

### `getBuildTimeVars(envVars)`

- [ ] Filter to keys starting with `NEXT_PUBLIC_`
- [ ] Return filtered `Record<string, string>`
- [ ] Return empty object if no matching keys

### Barrel Export

- [ ] Update `packages/core/src/deploy/index.ts` to export:
  - [ ] `getEnvVars`
  - [ ] `writeEnvFile`
  - [ ] `cleanupEnvFile`
  - [ ] `getBuildTimeVars`

### Type Safety

- [ ] `scope` parameter is `"production" | "preview"`
- [ ] All return types match documented signatures
- [ ] `pnpm typecheck` passes with no errors

### Security

- [ ] Secret values are never logged (only keys and counts)
- [ ] Temp file has restrictive permissions (0o600)
- [ ] Temp file is always cleaned up (called in finally block by Deployer)
- [ ] Decryption uses `decrypt()` from `@gblockparty/shared/backend`

---

## Verification

- [ ] Manual test: insert env vars (some secret) into DB, call `getEnvVars()`, verify all returned correctly
- [ ] Manual test: call `writeEnvFile()` with sample data, verify file content and permissions
- [ ] Manual test: call `writeEnvFile()` with empty object, verify no file created
- [ ] Manual test: call `cleanupEnvFile()` on existing file, verify deleted
- [ ] Manual test: call `cleanupEnvFile()` on non-existent file, verify no error
- [ ] Manual test: call `getBuildTimeVars()` with mixed vars, verify only NEXT_PUBLIC_ returned
- [ ] Verify temp directory `.tmp/env/` is created if it does not exist
- [ ] `pnpm typecheck` passes

---

## Notes

_Record any decisions or issues during implementation._
