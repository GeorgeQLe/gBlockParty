# Step 2 Milestone: Login Command

**Phase:** 9 -- CLI Tool
**Step:** 2 of 7

---

## Checklist

### OAuth Flow

- [ ] `gblockparty login` opens the default browser to `{apiUrl}/api/auth/github?cli=true&port={port}&state={state}`
- [ ] A random CSRF `state` parameter (32 hex chars) is generated for each login attempt
- [ ] A local HTTP server starts on `127.0.0.1` with port `0` (OS-assigned random port)
- [ ] The browser URL is printed to the terminal as a fallback for users who cannot auto-open

### Callback Handling

- [ ] The local server listens for `GET /callback` with `token`, `user`, and `state` query parameters
- [ ] CSRF `state` is validated -- mismatched state returns an error page and rejects the token
- [ ] Missing `token` or `user` parameters result in an error page and CLI failure
- [ ] An `error` parameter in the callback is handled gracefully (error message shown)
- [ ] The browser receives an HTML page confirming success ("You can close this tab")

### Token Storage

- [ ] The auth token is saved to `~/.gblockparty/config.json` via `saveGlobalConfig()`
- [ ] The `~/.gblockparty/` directory is created if it does not exist
- [ ] Existing config properties (e.g., `apiUrl`) are preserved when saving the token
- [ ] Re-running `gblockparty login` overwrites the previous token

### UX

- [ ] An ora spinner displays "Waiting for authentication..." while the browser flow is in progress
- [ ] On success, the spinner shows a green checkmark with "Authenticated as {username}"
- [ ] On failure, the spinner shows a red X with the error message
- [ ] The CLI exits with code 0 on success and code 1 on failure

### Cleanup

- [ ] The local HTTP server shuts down immediately after receiving the callback
- [ ] A 5-minute timeout shuts down the server if no callback is received
- [ ] No dangling processes remain after the command completes

### Dashboard Changes (if needed)

- [ ] `/api/auth/github` supports `cli=true&port={port}&state={state}` query parameters
- [ ] `/api/auth/github/callback` redirects to `http://localhost:{port}/callback?token={jwt}&user={login}&state={state}` when CLI mode is detected

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| OAuth flow opens browser | [ ] | |
| Local callback server works | [ ] | |
| Token saved to config | [ ] | |
| CSRF validation works | [ ] | |
| Error handling works | [ ] | |
| Timeout works | [ ] | |
| **Step 2 complete** | [ ] | |
