# Step 5 Milestone: Webhook Event Router

**Phase:** 3 | **Step:** 5 of 5
**Type:** Code implementation

---

## Checklist

### Webhook API Route (`/api/webhooks/github`)
- [ ] Parses JSON body after signature validation
- [ ] Returns 400 for malformed JSON
- [ ] Deduplicates by `x-github-delivery` header (returns 200 with `{ duplicate: true }` for repeat deliveries)
- [ ] Deduplication set capped at 1000 entries with FIFO eviction
- [ ] Calls `handleWebhook()` from `@gblockparty/core/github` with correct context
- [ ] Returns 200 immediately; webhook processing happens asynchronously
- [ ] Errors in async handler are caught and logged (do not crash the process)

### Push Event Handler
- [ ] Extracts repository full name, branch (strips `refs/heads/`), and commit SHA from payload
- [ ] Skips branch deletions (commit SHA is all zeros)
- [ ] Skips payloads with missing required fields (logs warning, does not throw)
- [ ] Logs intent to trigger production deployment (actual deployment queuing deferred to Phase 4/5)
- [ ] Handler structure is ready for Phase 4/5 to fill in: project lookup, branch check, deployment creation

### Pull Request Event Handler
- [ ] Routes `opened`, `synchronize`, `reopened` actions to preview deployment trigger
- [ ] Routes `closed` action to preview cleanup
- [ ] Extracts PR number, head SHA, head ref, base ref, merged status
- [ ] Skips payloads with missing required fields (logs warning, does not throw)
- [ ] Logs intent (actual preview build/cleanup deferred to Phase 7)
- [ ] Ignores unhandled PR actions (e.g., `labeled`, `assigned`) silently

### Installation Event Handler
- [ ] `created` action: inserts record into `github_installations` table
- [ ] `created` action: handles duplicate (upsert via `onConflictDoUpdate`)
- [ ] `deleted` action: removes record from `github_installations` table
- [ ] `deleted` action: handles non-existent record gracefully (no error)
- [ ] Skips payloads with missing installation data (logs warning)

### Commit Status (`setCommitStatus`)
- [ ] Calls `octokit.repos.createCommitStatus()` with owner, repo, sha, state
- [ ] Passes `target_url` for clickable link to deployment details
- [ ] Passes `description` (truncated to 140 chars per GitHub limit)
- [ ] Default context is `"gblockparty/deploy"`
- [ ] Supports all four states: `pending`, `success`, `failure`, `error`

### PR Comments (`createOrUpdatePRComment`)
- [ ] Searches existing PR comments for `<!-- gblockparty-bot -->` marker
- [ ] Updates existing bot comment if found (no duplicate comments)
- [ ] Creates new comment if no bot comment exists
- [ ] Handles paginated comment lists (PRs with many comments)
- [ ] Uses Issues API (`octokit.issues.createComment` / `updateComment`)

### Logging
- [ ] All webhook events logged at info level with event type, delivery ID, and action
- [ ] Unhandled events logged at debug level
- [ ] Errors logged with full context (event, deliveryId, error message)
- [ ] No sensitive data in logs (no tokens, no full payloads)

### Tests
- [ ] Webhook route: invalid signature rejected (401)
- [ ] Webhook route: valid signature accepted (200)
- [ ] Webhook route: duplicate delivery detected
- [ ] Webhook route: invalid JSON rejected (400)
- [ ] Push handler: normal push processed
- [ ] Push handler: branch deletion skipped
- [ ] PR handler: opened/synchronize/reopened processed
- [ ] PR handler: closed processed
- [ ] Installation handler: created inserts to DB
- [ ] Installation handler: deleted removes from DB
- [ ] Installation handler: duplicate created is idempotent
- [ ] setCommitStatus: correct API call made
- [ ] setCommitStatus: description truncated at 140 chars
- [ ] createOrUpdatePRComment: creates new when none exists
- [ ] createOrUpdatePRComment: updates existing by marker

---

## Files Modified

| File | Change |
|------|--------|
| `apps/dashboard/src/app/api/webhooks/github/route.ts` | Completed: JSON parsing, deduplication, `handleWebhook()` call |
| `packages/core/src/github/webhooks.ts` | Implemented: push, pull_request, installation handlers |
| `packages/core/src/github/commit-status.ts` | Implemented: `setCommitStatus()` with proper API call |
| `packages/core/src/github/pr-commenter.ts` | Implemented: `createOrUpdatePRComment()` with search/update logic |

---

## Verification

```bash
# Type-check all packages
pnpm typecheck

# Run core github tests
pnpm --filter @gblockparty/core test -- --testPathPattern=github

# Run dashboard webhook route tests
pnpm --filter @gblockparty/dashboard test -- --testPathPattern=webhooks

# Manual: trigger a webhook from GitHub
# 1. Push to a repo with the app installed
# 2. Check dashboard logs for "Push event: would trigger production deployment"
# 3. Open a PR on the repo
# 4. Check logs for "PR event: would trigger preview deployment"
# 5. Close the PR
# 6. Check logs for "PR closed: would trigger preview cleanup"

# Manual: verify installation tracking
# 1. Uninstall and reinstall the GitHub App on a repo
# 2. Query the database: SELECT * FROM github_installations;
# 3. Verify the installation record exists after install
# 4. Verify the installation record is gone after uninstall

# Manual: verify commit status (requires Phase 4/5 integration -- test with a script)
# node -e "
#   const { getGitHubAppClient } = require('@gblockparty/core/github');
#   const { setCommitStatus } = require('@gblockparty/core/github');
#   const client = getGitHubAppClient();
#   client.getInstallationOctokit(INSTALLATION_ID).then(async (octokit) => {
#     await setCommitStatus(octokit, 'owner', 'repo', 'COMMIT_SHA', 'success', {
#       description: 'Test status from gBlockParty',
#       context: 'gblockparty/test',
#     });
#     console.log('Status posted!');
#   });
# "
```

---

## Phase 3 Complete After This Step

When this step is done, all Phase 3 milestones should be met. Run the full verification from `phase-03-milestone.md` to confirm.
