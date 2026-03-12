# Step 4 Milestone: GitHub App Client Implementation

**Phase:** 3 | **Step:** 4 of 5
**Type:** Code implementation

---

## Checklist

### `getInstallationOctokit(installationId)`
- [ ] Returns an Octokit instance scoped to the given installation
- [ ] Returned Octokit can make authenticated GitHub API calls
- [ ] Uses `@octokit/app`'s built-in token management for the Octokit instance

### `getInstallationToken(installationId)`
- [ ] Returns a raw installation access token string
- [ ] First call for an installation fetches from GitHub API
- [ ] Subsequent calls within 55 minutes return the cached token (no API call)
- [ ] Calls after 55 minutes fetch a fresh token from GitHub API
- [ ] Different installation IDs are cached independently
- [ ] Token can be used for `git clone https://x-access-token:{token}@github.com/...`

### `invalidateToken(installationId)`
- [ ] Removes the cached token for the given installation
- [ ] Next call to `getInstallationToken()` fetches fresh from GitHub
- [ ] Does not throw if no cached token exists

### Singleton Pattern
- [ ] `getGitHubAppClient()` exported for shared access across the process
- [ ] Only one `App` instance exists regardless of call count
- [ ] Only one token cache exists (single `GitHubAppClient` instance)

### Logging
- [ ] Token fetch logged at info level (with installationId, no token value)
- [ ] Cache hit logged at debug level
- [ ] Token invalidation logged at info level

### Error Handling
- [ ] Invalid credentials throw (not swallowed silently)
- [ ] Missing installation throws (not swallowed)
- [ ] Token values never appear in log output

### Tests
- [ ] Test: first call fetches from API
- [ ] Test: cached token returned within TTL
- [ ] Test: fresh token fetched after TTL expires
- [ ] Test: separate cache entries per installation ID
- [ ] Test: invalidateToken forces refresh
- [ ] Test: getInstallationOctokit returns valid instance

---

## Files Modified

| File | Change |
|------|--------|
| `packages/core/src/github/app.ts` | Replaced TODO stubs with token caching and Octokit management |

---

## Verification

```bash
# Type-check
pnpm typecheck

# Run tests for the github module
pnpm --filter @gblockparty/core test -- --testPathPattern=github/app

# Manual: verify token works for a real installation
# (Requires a real GitHub App with at least one installation)
node -e "
  const { getGitHubAppClient } = require('@gblockparty/core/github');
  const client = getGitHubAppClient();
  client.getInstallationToken(YOUR_INSTALLATION_ID).then(t => {
    console.log('Token length:', t.length);
    console.log('Starts with ghs_:', t.startsWith('ghs_'));
  });
"
```
