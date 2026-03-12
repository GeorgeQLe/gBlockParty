# Step 7 Milestone: Rollback Command

**Phase:** 9 -- CLI Tool
**Step:** 7 of 7

---

## Checklist

### Interactive Selection

- [ ] Fetches up to 10 recent deployments via `GET /api/projects/:id/deployments?limit=10`
- [ ] Filters deployments to `ready` and `archived` status (excludes `failed`, `queued`, `building`)
- [ ] Displays deployment list with commit SHA (7 chars), branch, and timestamp
- [ ] Current production deployment is marked with `[current]` in green
- [ ] Current production deployment is disabled in the selection (cannot select it)
- [ ] Arrow keys navigate the list, Enter selects

### Direct ID Argument

- [ ] `gblockparty rollback <deploymentId>` skips interactive selection
- [ ] Invalid deployment ID (API 404) is handled with an error message

### Confirmation

- [ ] Confirmation prompt is shown before executing the rollback
- [ ] Default answer is No (prevents accidental rollbacks)
- [ ] Cancelling prints "Cancelled" and exits with code 0

### Rollback Execution

- [ ] `POST /api/projects/:id/deployments/:did/rollback` is called with correct parameters
- [ ] Ora spinner shows "Rolling back..." during the API call
- [ ] Success: prints green message with new deployment ID and URL
- [ ] Failure: prints red error message with details from the API

### Edge Cases

- [ ] No deployments available: prints informational message and exits with code 0
- [ ] Only the current deployment is available (no rollback targets): handled gracefully
- [ ] Auth and project link guards work
- [ ] API errors (401, 404, 500) are handled with informative messages

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Interactive selection works | [ ] | |
| Direct ID argument works | [ ] | |
| Confirmation prompt works | [ ] | |
| Rollback API call succeeds | [ ] | |
| Error handling works | [ ] | |
| **Step 7 complete** | [ ] | |
