# Step 2 Milestone: OAuth Callback Handler

**Phase:** 3 | **Step:** 2 of 5
**Type:** Code implementation

---

## Checklist

### OAuth Redirect Route (`/api/auth/github`)
- [ ] `redirect_uri` parameter included in OAuth URL, pointing to `/api/auth/github/callback`
- [ ] Random `state` nonce generated and included in OAuth URL
- [ ] `state` stored in `github-oauth-state` cookie (HTTP-only, 10-min expiry)
- [ ] Uses `NEXT_PUBLIC_DASHBOARD_URL` for building the redirect_uri

### OAuth Callback Route (`/api/auth/github/callback`)
- [ ] Extracts `code` and `state` from query parameters
- [ ] Verifies `state` matches the `github-oauth-state` cookie value
- [ ] Deletes `github-oauth-state` cookie after verification
- [ ] Exchanges code for access token via POST to `github.com/login/oauth/access_token`
- [ ] Sends request with `Accept: application/json` header (gets JSON response, not URL-encoded)
- [ ] Fetches user profile via GET to `api.github.com/user` with Bearer token
- [ ] Compares `user.id` against `ALLOWED_GITHUB_USER_ID` environment variable
- [ ] Rejects non-owner users with 403 status
- [ ] Creates JWT session via `createSession()` from `@/lib/auth`
- [ ] Sets session cookie via `setSessionCookie()` from `@/lib/auth`
- [ ] Redirects to dashboard root (`/`) after successful login

### Error Handling
- [ ] Missing `code` returns 400
- [ ] Missing or invalid `state` returns 403
- [ ] GitHub token exchange error returns 400 with GitHub's error description
- [ ] GitHub user API failure returns 502
- [ ] Non-owner user returns 403 with clear message
- [ ] Missing `GITHUB_CLIENT_ID` returns 500 (from redirect route)

### Security
- [ ] `GITHUB_CLIENT_SECRET` never exposed to the client (server-side only)
- [ ] State parameter prevents CSRF attacks on the OAuth flow
- [ ] Session cookie has correct flags: HTTP-only, Secure (in production), SameSite=Lax

---

## Files Modified

| File | Change |
|------|--------|
| `apps/dashboard/src/app/api/auth/github/route.ts` | Added `redirect_uri`, `state` param, state cookie |
| `apps/dashboard/src/app/api/auth/github/callback/route.ts` | Full implementation replacing TODO stub |

---

## Verification

```bash
# Type-check
pnpm typecheck

# Unit tests
pnpm --filter @gblockparty/dashboard test -- --testPathPattern=auth/github

# Manual: complete the full OAuth flow
# 1. Open browser to /api/auth/github
# 2. Authorize on GitHub
# 3. Verify redirect back to dashboard
# 4. Check cookie in browser dev tools
# 5. GET /api/auth/me should return user data
```
