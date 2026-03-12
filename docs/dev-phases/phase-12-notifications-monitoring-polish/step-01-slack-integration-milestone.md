# Step 1 Milestone: Slack Webhook Integration

**Phase:** 12 | **Step:** 1 of 6
**Type:** Backend implementation

---

## Checklist

### Implementation
- [ ] `sendSlackNotification()` stub replaced with working implementation
- [ ] HTTP POST to Slack webhook URL with JSON body
- [ ] Uses `fetch()` with `Content-Type: application/json`
- [ ] Timeout set to 10 seconds via `AbortSignal.timeout()`
- [ ] Color-coded attachments: red (failure), green (success), yellow (rollback)
- [ ] Attachment fields: project name, event type, status
- [ ] Error message included when present in payload
- [ ] Dashboard URL linked via `title_link`
- [ ] Footer: "gBlockParty"
- [ ] Timestamp: current Unix time

### Error Handling
- [ ] Non-200 response logged with status code and body
- [ ] Non-200 response throws descriptive error
- [ ] Network timeout handled gracefully
- [ ] No sensitive information in messages or logs

### Helper Functions
- [ ] `getStatusColor()` maps status to hex color
- [ ] `formatTitle()` creates descriptive title based on event type

### Tests
- [ ] Correct JSON payload generated for build failure
- [ ] Correct JSON payload generated for rollback event
- [ ] Non-200 response throws error
- [ ] Timeout handling works

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/notifications/notifier.ts` | Modify (replace sendSlackNotification stub) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| No test Slack webhook URL available | Create a test webhook in a personal Slack workspace or use a mock server |
| `fetch()` may not be available in older Node.js | Node.js 18+ has native fetch; verify minimum Node.js version |
