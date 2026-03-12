# Step 3 Milestone: Environment Variables API Routes

**Phase:** 6, Step 3
**Status:** Not Started

---

## Checklist

### GET /api/projects/:id/env
- [ ] Extracts `id` from route params and verifies project exists (404 if not)
- [ ] Reads `scope` query param, defaults to `"production"`
- [ ] Validates scope is `"production"` or `"preview"`, returns 400 for invalid scope
- [ ] Queries `env_vars` table filtered by `projectId` and `scope`
- [ ] Results ordered alphabetically by `key` (ascending)
- [ ] Secret values (`isSecret: true`) masked as `"***"` in response
- [ ] Non-secret values returned in plaintext
- [ ] Returns empty array when no env vars exist for the scope
- [ ] Returns 401 without valid session cookie

### POST /api/projects/:id/env
- [ ] Extracts `id` from route params and verifies project exists (404 if not)
- [ ] Parses and validates body with `createEnvVarSchema`
- [ ] Returns 400 with Zod error details on validation failure
- [ ] Key format enforced: `^[A-Z_][A-Z0-9_]*$`
- [ ] Encrypts value with AES-256-GCM (via `encrypt()`) when `isSecret: true`
- [ ] Stores plaintext value when `isSecret: false`
- [ ] Inserts into `env_vars` table via Drizzle ORM
- [ ] Returns 201 with created env var (secret value masked)
- [ ] Returns 409 when key already exists for the same project+scope
- [ ] Unique constraint violation detected by PostgreSQL error code `23505`
- [ ] Returns 401 without valid session cookie

### PATCH /api/projects/:id/env/:varId
- [ ] Extracts `id` and `varId` from route params
- [ ] Verifies project exists (404 if not)
- [ ] Verifies env var exists AND belongs to the project (404 if not)
- [ ] Parses and validates body with `updateEnvVarSchema`
- [ ] Returns 400 with Zod error details on validation failure
- [ ] Handles all isSecret transition cases:
  - [ ] non-secret to secret (with value): encrypts new value
  - [ ] non-secret to secret (no value): encrypts existing plaintext value
  - [ ] secret to non-secret (with value): stores new value as plaintext
  - [ ] secret to non-secret (no value): decrypts existing value, stores as plaintext
  - [ ] value update only (no isSecret change): encrypt/plaintext based on current isSecret
- [ ] Sets `updatedAt` to current timestamp
- [ ] Returns updated env var with masked secret value
- [ ] Returns 401 without valid session cookie

### DELETE /api/projects/:id/env/:varId
- [ ] Extracts `id` and `varId` from route params
- [ ] Verifies project exists (404 if not)
- [ ] Verifies env var exists AND belongs to the project (404 if not)
- [ ] Deletes the env var from the database
- [ ] Returns `{ deleted: true }`
- [ ] Returns 401 without valid session cookie

### Security
- [ ] `ENCRYPTION_KEY` env var is required for secret operations
- [ ] Encrypted values stored in `iv:tag:ciphertext` hex format
- [ ] Secret values never appear in any API response (always `"***"`)
- [ ] Encryption/decryption errors result in 500 (logged, not exposed to client)

### General
- [ ] All routes use `getDb()` singleton for database access
- [ ] All routes use `withAuth` middleware
- [ ] No TypeScript errors
- [ ] Error responses follow consistent format

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| GET /api/projects/:id/env | [ ] | |
| POST /api/projects/:id/env | [ ] | |
| PATCH /api/projects/:id/env/:varId | [ ] | |
| DELETE /api/projects/:id/env/:varId | [ ] | |
| Encryption integration tested | [ ] | |
| Manual testing complete | [ ] | |
| **Step 3 Complete** | [ ] | |
