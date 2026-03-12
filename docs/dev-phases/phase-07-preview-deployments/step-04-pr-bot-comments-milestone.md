# Step 4 Milestone: PR Bot Comment Management

**Phase:** 7 -- Preview Deployments
**Step:** 4 of 5
**Status:** Not Started

---

## Acceptance Criteria

- [ ] `createOrUpdatePRComment()` is fully implemented (no longer throws "Not implemented")
- [ ] Finds existing bot comment by searching for `BOT_COMMENT_MARKER` in comment body
- [ ] Updates existing comment via `octokit.issues.updateComment()` when found
- [ ] Creates new comment via `octokit.issues.createComment()` when not found
- [ ] Comment body includes marker, status, URL (when available), and build time (when available)
- [ ] Only one bot comment per PR (no duplicates across multiple pushes)
- [ ] Errors caught and logged (function never throws)
- [ ] Uses installation-scoped Octokit
- [ ] Unit tests pass for create, update, and error paths

---

## Comment Behavior Verification

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| First push to PR | New comment created with marker | [ ] |
| Second push to PR | Existing comment updated (same comment ID) | [ ] |
| Third push to PR | Same comment updated again | [ ] |
| Build success | Comment shows status=ready, URL, build time | [ ] |
| Build failure | Comment shows status=failed, no URL | [ ] |
| Build in progress (optional) | Comment shows status=building | [ ] |

---

## Comment Content Verification

### Successful Deployment

The comment should contain:

- [ ] `<!-- gblockparty-bot -->` marker (invisible in rendered markdown)
- [ ] Status emoji and header: `## ✅ Preview Deployment`
- [ ] `**Status:** ready`
- [ ] `**URL:** https://pr-{N}--{slug}.{domain}`
- [ ] `**Build time:** {N.N}s`

### Failed Deployment

The comment should contain:

- [ ] `<!-- gblockparty-bot -->` marker
- [ ] Status emoji and header: `## ❌ Preview Deployment`
- [ ] `**Status:** failed`
- [ ] No URL line
- [ ] No build time line (or shows time if build completed before deploy failed)

---

## `findBotComment` Behavior

| Scenario | Expected Result | Verified |
|----------|----------------|----------|
| No comments on PR | Returns `null` (create new) | [ ] |
| Comments exist but none from bot | Returns `null` (create new) | [ ] |
| Bot comment exists among other comments | Returns comment ID | [ ] |
| Bot comment is the only comment | Returns comment ID | [ ] |
| Multiple bot comments (edge case) | Returns first one found | [ ] |
| GitHub API error during search | Returns `null`, logs error (create new) | [ ] |

---

## Error Handling Verification

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| `listComments` API fails | Error logged, no throw | [ ] |
| `createComment` API fails | Error logged, no throw | [ ] |
| `updateComment` API fails | Error logged, no throw | [ ] |
| Rate limit exceeded | Error logged, no throw | [ ] |
| Invalid PR number (PR deleted) | Error logged, no throw | [ ] |

---

## Unit Test Results

| Test | Result | Notes |
|------|--------|-------|
| Creates new comment when no bot comment exists | _PASS/FAIL_ | |
| Updates existing comment when bot comment found | _PASS/FAIL_ | |
| Handles API error without throwing | _PASS/FAIL_ | |
| `formatDeploymentComment` includes marker | _PASS/FAIL_ | |
| `formatDeploymentComment` includes URL when provided | _PASS/FAIL_ | |
| `formatDeploymentComment` omits URL when null | _PASS/FAIL_ | |
| `formatDeploymentComment` formats build time in seconds | _PASS/FAIL_ | |

---

## GitHub UI Verification (Manual)

| Check | Result | Notes |
|-------|--------|-------|
| Bot comment visible on PR | _PASS/FAIL_ | |
| Comment shows correct status | _PASS/FAIL_ | |
| Preview URL is clickable | _PASS/FAIL_ | |
| Build time is displayed | _PASS/FAIL_ | |
| Comment updates on new push (not duplicated) | _PASS/FAIL_ | |
| Comment updates to failure on failed build | _PASS/FAIL_ | |
| Marker is not visible in rendered comment | _PASS/FAIL_ | |

---

## Sign-Off

| Criteria | Met | Notes |
|----------|-----|-------|
| Create path works (new PR, no existing comment) | [ ] | |
| Update path works (existing comment found and updated) | [ ] | |
| Error handling covers all API calls | [ ] | |
| No duplicate comments across multiple pushes | [ ] | |
| Unit tests pass | [ ] | |
| **Step 4 Complete** | [ ] | |
