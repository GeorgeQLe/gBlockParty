# Step 4 Milestone: Deploy Command

**Phase:** 9 -- CLI Tool
**Step:** 4 of 7

---

## Checklist

### Prerequisites

- [ ] Command checks for auth token (exits with message if not logged in)
- [ ] Command checks for linked project (exits with message if not linked)
- [ ] `--prod` flag is supported for production deployments
- [ ] `-b/--branch` flag overrides auto-detected git branch

### Git Detection

- [ ] Current branch is auto-detected via `git rev-parse --abbrev-ref HEAD`
- [ ] Current commit SHA is auto-detected via `git rev-parse HEAD`
- [ ] Gracefully handles non-git directories (allows `--branch` override)

### API Request

- [ ] `POST /api/cli/deploy` is called with `{ projectId, branch, commitSha, production }`
- [ ] API errors are handled: 401 (auth), 404 (project not found), 500 (server error)
- [ ] Deployment ID and stream URL are received from the response
- [ ] An ora spinner shows "Triggering deployment..." during the API call

### Build Log Streaming

- [ ] Connects to the stream URL (WebSocket or SSE) for real-time build logs
- [ ] ANSI escape codes in log output are preserved (colored output from build tools)
- [ ] Each log line is written to stdout as it arrives
- [ ] The `[DONE]` sentinel (or stream close) signals end of build logs
- [ ] Stream connection failure is handled gracefully (prints warning, continues to status check)
- [ ] Stream reconnection is attempted once on connection drop

### Final Status

- [ ] After stream ends, deployment status is fetched via `GET /api/projects/:id/deployments/:did`
- [ ] Status `ready`: prints green success message with deployment URL
- [ ] Status `failed`: prints red failure message with error details, exits with code 1
- [ ] Other statuses: prints yellow informational message, directs user to dashboard

### Output

- [ ] Deployment type and branch are printed before the deployment starts
- [ ] Commit SHA (short, 7 chars) is shown in the initial output
- [ ] Build logs are separated by `--- Build Logs ---` header
- [ ] Deployment URL is prominently displayed on success

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Auth and project guards work | [ ] | |
| Git info detection works | [ ] | |
| API request succeeds | [ ] | |
| Build log streaming works | [ ] | |
| Success output correct | [ ] | |
| Failure output correct | [ ] | |
| **Step 4 complete** | [ ] | |
