# Step 2 Milestone: Discord Webhook Integration

**Phase:** 12 | **Step:** 2 of 6
**Type:** Backend implementation

---

## Checklist

### Implementation
- [ ] `sendDiscordNotification()` stub replaced with working implementation
- [ ] HTTP POST to Discord webhook URL with JSON body
- [ ] Uses `fetch()` with `Content-Type: application/json`
- [ ] Timeout set to 10 seconds via `AbortSignal.timeout()`
- [ ] Username override: "gBlockParty"
- [ ] Embed format with color, fields, footer, timestamp
- [ ] Color as decimal number: red (0xFF0000), green (0x36A64F), yellow (0xFFA500)
- [ ] Fields: project name, event type, status (all inline)
- [ ] Error message as embed description (when present)
- [ ] Dashboard URL as embed `url`
- [ ] Timestamp in ISO 8601 format

### Error Handling
- [ ] HTTP 204 treated as success
- [ ] HTTP 429 rate limiting: retry after `retry-after` header delay
- [ ] Non-2xx response logged with status and body
- [ ] Non-2xx response throws descriptive error
- [ ] Network timeout handled gracefully
- [ ] Error messages truncated to 4096 chars (Discord limit)

### Shared Code
- [ ] `formatTitle()` reused from Step 1
- [ ] `getDiscordColor()` returns decimal color values (separate from Slack's hex)

### Tests
- [ ] Correct JSON payload generated for build failure
- [ ] Correct JSON payload generated for rollback
- [ ] 204 response handled as success
- [ ] 429 rate limit handled with retry
- [ ] Non-2xx throws error
- [ ] Long error messages truncated

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/notifications/notifier.ts` | Modify (replace sendDiscordNotification stub) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| No test Discord webhook URL available | Create a test webhook in a personal Discord server |
| Discord API changes embed format | Use well-documented stable embed format; pin to current API version |
