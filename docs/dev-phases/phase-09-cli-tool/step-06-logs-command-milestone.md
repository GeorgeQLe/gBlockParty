# Step 6 Milestone: Logs Command

**Phase:** 9 -- CLI Tool
**Step:** 6 of 7

---

## Checklist

### Static Log Viewing

- [ ] Fetches the latest deployment via `GET /api/projects/:id/deployments?limit=1`
- [ ] Fetches completed logs via `GET /api/projects/:id/deployments/:did/logs`
- [ ] Displays deployment metadata header (commit SHA, branch, status, timestamp)
- [ ] Status is color-coded: green (ready), red (failed), yellow (building/deploying), blue (queued)
- [ ] Default line limit is 100 lines (shows the last 100 lines)
- [ ] `-n <number>` overrides the line limit
- [ ] Truncation message is shown when output is limited ("showing last N of M lines")
- [ ] ANSI escape codes in log output are preserved

### Real-time Streaming (`-f` flag)

- [ ] `-f` flag connects to the SSE/WebSocket stream endpoint for in-progress builds
- [ ] Log lines are written to stdout as they arrive
- [ ] `[DONE]` sentinel triggers clean exit with "Build complete" message
- [ ] Stream connection failures are handled gracefully (warning message, no crash)
- [ ] Using `-f` with a completed build shows static logs with informational message

### Edge Cases

- [ ] No deployments exist: prints informational message and exits with code 0
- [ ] No logs available: prints "No logs available" message
- [ ] Handles authentication failure (401) with helpful message
- [ ] Handles missing project (404) with helpful message

### Prerequisites

- [ ] Command requires authentication (exits with message if not logged in)
- [ ] Command requires a linked project (exits with message if not linked)

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Static log viewing works | [ ] | |
| Line limit works | [ ] | |
| Real-time streaming works | [ ] | |
| Status color-coding works | [ ] | |
| Edge cases handled | [ ] | |
| **Step 6 complete** | [ ] | |
