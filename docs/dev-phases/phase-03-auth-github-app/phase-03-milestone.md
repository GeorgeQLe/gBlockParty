# Phase 3 Milestone: Authentication & GitHub App Integration

**Phase:** 3 of 12
**Depends on:** Phase 1 (VPS with public IP), Phase 2 (Database migrations applied)
**Blocks:** Phase 4 (Build system needs installation tokens), Phase 5 (Deployment engine needs commit status), Phase 6 (Dashboard API needs auth), Phase 7 (Previews need webhook routing)

---

## Definition of Done

All of the following must be true before this phase is complete:

### Authentication

- [ ] GitHub App registered on github.com with correct permissions and webhook URL
- [ ] GitHub App credentials (App ID, private key, client ID, client secret, webhook secret) stored in AWS Secrets Manager
- [ ] OAuth flow works end-to-end: click "Login with GitHub" -> GitHub authorize -> redirect back -> session cookie set
- [ ] Only the allowed GitHub user (by numeric ID) can authenticate; all others receive a 403
- [ ] `GET /api/auth/me` returns the authenticated user's `userId`, `githubLogin`, and `githubId`
- [ ] `POST /api/auth/logout` clears the session cookie and subsequent requests to `/api/auth/me` return 401
- [ ] Session JWT has 7-day expiry, HTTP-only cookie, Secure flag in production, SameSite=Lax
- [ ] OAuth redirect includes `state` parameter for CSRF protection

### GitHub App Client

- [ ] `GitHubAppClient.getInstallationOctokit(installationId)` returns a working Octokit instance scoped to the installation
- [ ] `GitHubAppClient.getInstallationToken(installationId)` returns a valid token string
- [ ] Installation tokens are cached in memory with ~55-minute TTL (refresh before 1-hour expiry)
- [ ] Requesting a token for the same installation within the cache window returns the cached token (no new API call)
- [ ] Requesting a token after cache expiry fetches a fresh token from GitHub

### Webhook Handling

- [ ] `POST /api/webhooks/github` validates HMAC-SHA256 signature (rejects invalid with 401)
- [ ] Webhook handler parses JSON payload and routes to correct handler based on `x-github-event` header
- [ ] `push` events: handler identifies repo and branch, would trigger production deployment (logs intent for now -- actual build queue is Phase 4)
- [ ] `pull_request` events with `opened`/`synchronize`/`reopened` action: handler identifies PR and would trigger preview deployment (logs intent)
- [ ] `pull_request` events with `closed` action: handler identifies PR and would trigger preview cleanup (logs intent)
- [ ] `installation` events with `created` action: inserts record into `github_installations` table
- [ ] `installation` events with `deleted` action: removes record from `github_installations` table
- [ ] Duplicate webhook deliveries (same `x-github-delivery` header) are handled idempotently

### Commit Status & PR Comments

- [ ] `setCommitStatus()` successfully posts pending/success/failure/error status to a GitHub commit via the API
- [ ] `createOrUpdatePRComment()` creates a new comment on a PR if no bot comment exists
- [ ] `createOrUpdatePRComment()` updates the existing bot comment if one already exists (identified by `<!-- gblockparty-bot -->` marker)
- [ ] Bot comments never duplicate -- running the function twice for the same PR results in one comment, not two

---

## Step Completion Tracking

| Step | Name | Status | Notes |
|------|------|--------|-------|
| 1 | GitHub App Registration & Configuration | Not Started | Manual setup on github.com + Secrets Manager |
| 2 | OAuth Callback Handler | Not Started | `callback/route.ts` implementation |
| 3 | Auth API Routes | Not Started | `/me` and `/logout` verification + hardening |
| 4 | GitHub App Client Implementation | Not Started | `GitHubAppClient` with token caching |
| 5 | Webhook Event Router | Not Started | `handleWebhook` + commit status + PR comments |

---

## Verification Commands

```bash
# Type-check all packages (should pass with no errors)
pnpm typecheck

# Run tests for the core github module
pnpm --filter @gblockparty/core test -- --testPathPattern=github

# Run tests for dashboard auth routes
pnpm --filter @gblockparty/dashboard test -- --testPathPattern=auth

# Manual: complete OAuth login flow in browser
open https://platform.yourdomain.dev/api/auth/github

# Manual: verify session cookie is set after login
curl -v https://platform.yourdomain.dev/api/auth/me --cookie "gblockparty-session=<jwt>"

# Manual: verify webhook delivery from GitHub
# (Push to a repo with the app installed, check dashboard logs)

# Manual: verify commit status appears on GitHub
# (After webhook processing, check the commit on github.com for the status check)
```

---

## Risk Factors

| Risk | Mitigation |
|------|-----------|
| GitHub App registration requires manual steps on github.com | Step 1 documents every click with screenshots/descriptions |
| OAuth callback can fail silently if redirect_uri doesn't match | Ensure `NEXT_PUBLIC_DASHBOARD_URL` is set correctly before testing |
| Installation token caching bugs could cause auth failures | Unit tests with mocked timers to test cache expiry behavior |
| Webhook handler needs to return 200 within 10 seconds (GitHub timeout) | Handler returns immediately, processes async; no blocking DB queries in hot path |
| Private key format (PEM) is multi-line and tricky in env vars | Store in Secrets Manager as-is; load with proper newline handling |

---

## Handoff Notes

When this phase is complete, the following capabilities are available for subsequent phases:

- **Phase 4 (Build System):** Can call `GitHubAppClient.getInstallationToken(installationId)` to get a token for `git clone https://x-access-token:{token}@github.com/{owner}/{repo}.git`
- **Phase 5 (Deployment Engine):** Can call `setCommitStatus()` to update commit status to pending/success/failure during deployment
- **Phase 6 (Dashboard API):** All API route handlers can use `withAuth(handler)` wrapper and be confident the session is validated
- **Phase 7 (Preview Deployments):** Webhook router already dispatches `pull_request` events; Phase 7 implements the actual preview build/deploy logic that the handler calls
