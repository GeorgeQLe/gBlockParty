# Step 4 Milestone: GitHub Webhook Handler

**Phase:** 6, Step 4
**Status:** Not Started

---

## Checklist

### Route Handler (`apps/dashboard/src/app/api/webhooks/github/route.ts`)
- [ ] Parses request body as JSON after signature verification
- [ ] Extracts `x-github-delivery` header for deduplication
- [ ] Checks delivery ID against deduplication store (in-memory Set)
- [ ] Returns 200 `{ received: true, deduplicated: true }` for duplicate delivery IDs
- [ ] Records delivery ID after successful processing
- [ ] Deduplication store bounded to 10,000 entries (evicts oldest)
- [ ] Calls `handleWebhook()` from `@gblockparty/core/github` with parsed context
- [ ] Catches and logs errors from `handleWebhook()` without returning non-200
- [ ] Returns 200 `{ received: true }` for all valid-signature requests
- [ ] Response time under 500ms for push events

### Push Event Handler (`packages/core/src/github/webhooks.ts`)
- [ ] Extracts branch from `ref` field (strips `refs/heads/` prefix)
- [ ] Extracts commit SHA from `after` field
- [ ] Extracts repo full name and installation ID from payload
- [ ] Skips processing if required fields are missing (logs warning)
- [ ] Looks up project by `githubInstallationId` AND `githubRepoFullName`
- [ ] Skips processing if no matching project found (logs info)
- [ ] Compares branch to project's `productionBranch`
- [ ] Skips processing if branch does not match production branch (logs debug)
- [ ] Creates deployment record with `type: "production"`, `status: "queued"`, correct `commitSha` and `branch`
- [ ] Enqueues build via `BuildQueue.enqueue()`
- [ ] Build queue receives correct `id` (deployment ID) and `projectId`

### Pull Request Event Handler
- [ ] Logs the event action and PR number
- [ ] Returns without side effects (placeholder for Phase 7)
- [ ] Handles actions: opened, synchronize, reopened, closed (all logged)

### Installation Event Handler
- [ ] Handles `action: "created"`: inserts into `github_installations` table (upsert)
- [ ] Handles `action: "deleted"`: deletes from `github_installations` table
- [ ] Logs installation ID and account login for both actions
- [ ] Skips processing if installation data is missing (logs warning)

### Unknown Events
- [ ] Unknown event types logged at debug level
- [ ] Returns 200 for unknown event types

### Error Handling
- [ ] All handler errors caught and logged (never return non-200 after valid signature)
- [ ] Missing webhook secret returns 500 (already implemented)
- [ ] Invalid signature returns 401 (already implemented)

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Route handler deduplication | [ ] | |
| Push event: project lookup | [ ] | |
| Push event: branch filtering | [ ] | |
| Push event: deployment creation | [ ] | |
| Push event: build queue enqueue | [ ] | |
| Pull request: placeholder logging | [ ] | |
| Installation: created handler | [ ] | |
| Installation: deleted handler | [ ] | |
| Error handling verified | [ ] | |
| Manual testing complete | [ ] | |
| **Step 4 Complete** | [ ] | |
