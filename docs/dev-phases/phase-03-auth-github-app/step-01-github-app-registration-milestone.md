# Step 1 Milestone: GitHub App Registration & Configuration

**Phase:** 3 | **Step:** 1 of 5
**Type:** Manual setup (no code changes)

---

## Checklist

### GitHub App Registration
- [ ] App created at `https://github.com/settings/apps/new`
- [ ] App name set (e.g., `gBlockParty`)
- [ ] Homepage URL set to platform dashboard URL
- [ ] OAuth callback URL set to `/api/auth/github/callback`
- [ ] Webhook URL set to `/api/webhooks/github`
- [ ] Webhook secret generated (32+ character random hex string)

### Permissions Configured
- [ ] `contents: read` -- for cloning repos
- [ ] `pull_requests: read & write` -- for PR bot comments
- [ ] `statuses: read & write` -- for commit status checks
- [ ] `checks: read & write` -- for check runs with build logs

### Events Subscribed
- [ ] `push` events
- [ ] `pull_request` events
- [ ] `installation` events

### Credentials Generated
- [ ] App ID noted from settings page
- [ ] Client ID noted from settings page
- [ ] Client secret generated and noted
- [ ] Private key `.pem` file downloaded
- [ ] Webhook secret recorded

### AWS Secrets Manager
- [ ] `gblockparty/github-app-id` created
- [ ] `gblockparty/github-app-private-key` created (full PEM content)
- [ ] `gblockparty/github-app-webhook-secret` created
- [ ] `gblockparty/github-client-id` created
- [ ] `gblockparty/github-client-secret` created
- [ ] `gblockparty/jwt-secret` created (64-char random hex)

### Local Development
- [ ] `.env.local` created in `apps/dashboard/` with all required variables
- [ ] Verified `.env.local` is in `.gitignore`

### App Installation
- [ ] App installed on at least one test repository
- [ ] Installation ID recorded for testing

---

## Credential Reference

_Fill in after completing registration (do NOT store actual secret values here):_

| Credential | Location | Identifier |
|-----------|----------|-----------|
| App ID | Secrets Manager | `gblockparty/github-app-id` |
| Private Key | Secrets Manager | `gblockparty/github-app-private-key` |
| Webhook Secret | Secrets Manager | `gblockparty/github-app-webhook-secret` |
| Client ID | Secrets Manager | `gblockparty/github-client-id` |
| Client Secret | Secrets Manager | `gblockparty/github-client-secret` |
| JWT Secret | Secrets Manager | `gblockparty/jwt-secret` |
| Installation ID | _note here_ | _for test repo_ |
| Allowed User ID | _note here_ | _your GitHub numeric user ID_ |

---

## How to Find Your GitHub User ID

```bash
curl -s https://api.github.com/users/YOUR_USERNAME | jq '.id'
```

This numeric ID goes into the `ALLOWED_GITHUB_USER_ID` environment variable.
