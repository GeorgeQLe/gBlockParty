# Step 3 Milestone: GitHub Commit Status Integration

**Phase:** 7 -- Preview Deployments
**Step:** 3 of 5
**Status:** Not Started

---

## Acceptance Criteria

- [ ] `setCommitStatus()` in `packages/core/src/github/commit-status.ts` is fully implemented
- [ ] Calls `octokit.repos.createCommitStatus()` with correct parameters
- [ ] Default context string is `gblockparty/preview`
- [ ] Default descriptions provided for all four states (pending, success, failure, error)
- [ ] `target_url` passed through for success state (preview URL)
- [ ] Description truncated to 140 characters
- [ ] GitHub API errors caught and logged (not thrown)
- [ ] Uses installation-scoped Octokit
- [ ] Unit tests pass for all states and error cases

---

## Status State Verification

| State | Default Description | Target URL | Verified |
|-------|-------------------|------------|----------|
| `pending` | "Preview deployment building..." | None | [ ] |
| `success` | "Preview deployment ready" | Preview URL | [ ] |
| `failure` | "Preview deployment failed" | None | [ ] |
| `error` | "Preview deployment encountered an error" | None | [ ] |

---

## API Call Verification

| Parameter | Expected Value | Verified |
|-----------|---------------|----------|
| `owner` | Repository owner (from `repoFullName.split('/')`) | [ ] |
| `repo` | Repository name (from `repoFullName.split('/')`) | [ ] |
| `sha` | Full 40-character commit SHA | [ ] |
| `state` | One of: `pending`, `success`, `failure`, `error` | [ ] |
| `target_url` | Preview URL (on success) or undefined | [ ] |
| `description` | Max 140 chars, default provided per state | [ ] |
| `context` | `gblockparty/preview` | [ ] |

---

## Error Handling Verification

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| GitHub API returns 403 (rate limited) | Error logged, function returns without throwing | [ ] |
| GitHub API returns 404 (repo not found) | Error logged, function returns without throwing | [ ] |
| GitHub API returns 422 (invalid SHA) | Error logged, function returns without throwing | [ ] |
| Network timeout | Error logged, function returns without throwing | [ ] |
| Octokit instance is invalid | Error logged, function returns without throwing | [ ] |

---

## Unit Test Results

| Test | Result | Notes |
|------|--------|-------|
| Correct parameters for `pending` state | _PASS/FAIL_ | |
| Correct parameters for `success` state with target URL | _PASS/FAIL_ | |
| Correct parameters for `failure` state | _PASS/FAIL_ | |
| Default description used when none provided | _PASS/FAIL_ | |
| Custom description used when provided | _PASS/FAIL_ | |
| Description truncated at 140 chars | _PASS/FAIL_ | |
| Does not throw on API error | _PASS/FAIL_ | |
| Default context is `gblockparty/preview` | _PASS/FAIL_ | |
| Custom context used when provided | _PASS/FAIL_ | |

---

## GitHub UI Verification (Manual)

| Check | Result | Notes |
|-------|--------|-------|
| Pending status visible on commit | _PASS/FAIL_ | Yellow dot with "Preview deployment building..." |
| Success status visible on commit | _PASS/FAIL_ | Green checkmark with "Preview deployment ready" |
| "Details" link goes to preview URL | _PASS/FAIL_ | Clicking "Details" opens the preview deployment |
| Failure status visible on commit | _PASS/FAIL_ | Red X with failure description |
| Same context updates (not duplicates) | _PASS/FAIL_ | Setting new status with same context replaces old |

---

## Sign-Off

| Criteria | Met | Notes |
|----------|-----|-------|
| All four states produce correct API calls | [ ] | |
| Error suppression works (no deployment failures from status API) | [ ] | |
| Unit tests pass | [ ] | |
| Manual GitHub UI verification done | [ ] | |
| **Step 3 Complete** | [ ] | |
