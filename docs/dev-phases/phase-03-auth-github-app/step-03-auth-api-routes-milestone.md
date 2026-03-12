# Step 3 Milestone: Auth API Routes

**Phase:** 3 | **Step:** 3 of 5
**Type:** Code verification + testing

---

## Checklist

### `/api/auth/me` (GET)
- [ ] Returns 200 with `{ userId, githubLogin, githubId }` when valid session cookie is present
- [ ] Returns 401 with `{ error: "Unauthorized" }` when no session cookie is present
- [ ] Returns 401 when JWT is expired (>7 days old)
- [ ] Returns 401 when JWT is malformed or tampered with
- [ ] Returns 401 when JWT was signed with a different secret

### `/api/auth/logout` (POST)
- [ ] Returns 200 with `{ ok: true }` and clears the `gblockparty-session` cookie
- [ ] Returns 200 even if no session cookie was present (idempotent)
- [ ] After logout, GET `/api/auth/me` returns 401

### `withAuth` Middleware
- [ ] Passes `session` object to wrapped handler when authenticated
- [ ] Returns 401 and does not call wrapped handler when not authenticated
- [ ] Works correctly with Next.js 15 App Router route handlers

### End-to-End Flow
- [ ] Login via OAuth (Step 2) -> `/api/auth/me` returns user data -> `/api/auth/logout` -> `/api/auth/me` returns 401

### Tests Written
- [ ] Unit tests for `/api/auth/me` (valid session, no session, expired JWT, malformed JWT)
- [ ] Unit tests for `/api/auth/logout` (with session, without session)
- [ ] Unit tests for `withAuth` middleware (authenticated, unauthenticated)

---

## Files Modified

| File | Change |
|------|--------|
| `apps/dashboard/src/app/api/auth/me/route.ts` | No changes expected (already correct) |
| `apps/dashboard/src/app/api/auth/logout/route.ts` | No changes expected (already correct) |

---

## Verification

```bash
# Type-check
pnpm typecheck

# Run auth tests
pnpm --filter @gblockparty/dashboard test -- --testPathPattern=auth

# Manual: Full login/me/logout cycle
curl -c cookies.txt http://localhost:3000/api/auth/github  # follow redirects through OAuth
curl -b cookies.txt http://localhost:3000/api/auth/me       # should return user data
curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout  # should return { ok: true }
curl -b cookies.txt http://localhost:3000/api/auth/me       # should return 401
```
