# Step 1 Milestone: PR Webhook Handler

**Phase:** 7 -- Preview Deployments
**Step:** 1 of 5
**Status:** Not Started

---

## Acceptance Criteria

- [ ] `handleWebhook()` processes `pull_request` events without errors
- [ ] Deployment record created for `opened` action with correct fields
- [ ] Deployment record created for `synchronize` action with correct fields
- [ ] Deployment record created for `reopened` action with correct fields
- [ ] Cleanup triggered for `closed` action (merged and unmerged)
- [ ] Project lookup by installationId + repoFullName succeeds
- [ ] Missing project returns gracefully (no error)
- [ ] Duplicate commit+PR combination is detected and skipped
- [ ] Async build dispatch does not block webhook response
- [ ] All errors caught and logged (webhook always returns 200)
- [ ] Unrecognized PR actions logged at debug level and ignored

---

## Deployment Record Verification

When a PR is opened, the created deployment record must have:

| Field | Expected Value |
|-------|---------------|
| `project_id` | Matches the connected project |
| `type` | `'preview'` |
| `status` | `'queued'` |
| `commit_sha` | PR head commit SHA (full 40 chars) |
| `branch` | PR head branch name (e.g., `feature/my-feature`) |
| `pr_number` | PR number (e.g., 42) |
| `docker_image_tag` | `null` (set later in Step 2) |
| `container_id` | `null` (set later in Step 2) |
| `port` | `null` (set later in Step 2) |
| `url` | `null` (set later in Step 2) |

---

## Action Routing Verification

| Webhook Action | Expected Behavior | Verified |
|----------------|-------------------|----------|
| `opened` | Creates deployment record, dispatches build | [ ] |
| `synchronize` | Creates deployment record, dispatches build | [ ] |
| `reopened` | Creates deployment record, dispatches build | [ ] |
| `closed` (not merged) | Finds active preview, triggers cleanup | [ ] |
| `closed` (merged) | Finds active preview, triggers cleanup | [ ] |
| `edited` | Logged and ignored | [ ] |
| `labeled` | Logged and ignored | [ ] |
| `assigned` | Logged and ignored | [ ] |

---

## Edge Cases Verified

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| PR from repo not connected to platform | Log warning, return without error | [ ] |
| PR with same commit SHA already has deployment | Skip (deduplication) | [ ] |
| PR closed but no active preview exists | Log info, return without error | [ ] |
| Webhook payload missing `installation.id` | Handle gracefully, log error | [ ] |
| DB error during project lookup | Catch, log, return | [ ] |
| DB error during deployment insert | Catch, log, return | [ ] |

---

## Sign-Off

| Criteria | Met | Notes |
|----------|-----|-------|
| All PR actions handled or ignored | [ ] | |
| Deployment records verified in DB | [ ] | |
| Cleanup delegation works | [ ] | |
| Error handling covers all paths | [ ] | |
| Webhook response time < 500ms | [ ] | |
| **Step 1 Complete** | [ ] | |
