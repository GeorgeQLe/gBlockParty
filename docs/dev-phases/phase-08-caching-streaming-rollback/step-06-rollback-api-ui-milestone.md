# Step 6 Milestone: Rollback API & Dashboard UI

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 6 of 8

---

## Checklist

### API Endpoint
- [ ] POST handler implemented in `.../rollback/route.ts`
- [ ] Validates deployment exists and belongs to project
- [ ] Rejects preview deployments (422)
- [ ] Rejects already-active deployment (409)
- [ ] Rejects deployments without Docker image tag (422)
- [ ] Calls `rollbackDeployment()` from core package
- [ ] Returns new deployment ID and URL on success (200)
- [ ] Returns clear error messages on failure
- [ ] Handles pruned image error (422)
- [ ] Authentication enforced via `withAuth`

### Deployment List UI
- [ ] Deployment list page displays recent deployments
- [ ] Each row shows: commit SHA, branch, type, status, timestamp, duration
- [ ] Active production deployment has "Active" badge and visual highlight
- [ ] "Rollback to this version" button shown on eligible deployments
- [ ] Button hidden for: active deployment, preview deployments, imageless deployments
- [ ] Rollback deployments show "Rolled back to {sha}" with source link
- [ ] Type badges distinguish `production`, `preview`, `rollback`

### Confirmation Dialog
- [ ] Modal appears on rollback button click
- [ ] Shows commit SHA and branch of target deployment
- [ ] Has Cancel and Confirm buttons
- [ ] Confirm button styled as destructive action
- [ ] Loading state during rollback execution
- [ ] Success: dialog closes, list refreshes
- [ ] Error: error message shown in dialog without closing

### Deployment Detail Page
- [ ] "Deploy this version to production" button on eligible deployments
- [ ] Same confirmation dialog behavior
- [ ] Redirect to new deployment page after successful rollback

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| POST endpoint implemented | [ ] | |
| Validation logic complete | [ ] | |
| Deployment list UI updated | [ ] | |
| Confirmation dialog working | [ ] | |
| End-to-end rollback from UI | [ ] | |
| **Step 6 complete** | [ ] | |
