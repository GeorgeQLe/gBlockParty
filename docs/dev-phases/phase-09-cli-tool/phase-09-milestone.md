# Phase 9 Milestone: CLI Tool

**Phase:** 9 of 12
**Depends on:** Phase 3 (Auth), Phase 6 (Dashboard API), Phase 8 (Log streaming, rollback)
**Blocks:** None

---

## Definition of Done

All of the following must be true before this phase is complete:

### CLI API Routes

- [ ] `POST /api/cli/deploy` accepts `{ projectId, branch, commitSha, production }`, validates Bearer token, queues a deployment, and returns `{ deploymentId, streamUrl }`
- [ ] `POST /api/cli/deploy` returns 401 when no token or invalid token is provided
- [ ] `POST /api/cli/deploy` returns 404 when the project ID does not exist
- [ ] `GET /api/cli/env/:projectId?scope=production` returns env vars for the project with secret values masked as `***`
- [ ] `GET /api/cli/env/:projectId?scope=preview` returns env vars for the preview scope
- [ ] `POST /api/cli/env/:projectId` with `{ scope, vars: [{ key, value }] }` upserts env vars and returns `{ updated: N }`
- [ ] All CLI API routes validate the Bearer token using the same auth system as the dashboard

### Login Command

- [ ] `gblockparty login` opens the default browser to the GitHub OAuth authorization URL
- [ ] A local HTTP server starts on a random available port on `127.0.0.1` to receive the OAuth callback
- [ ] After successful OAuth, the auth token is saved to `~/.gblockparty/config.json`
- [ ] The local callback server shuts down immediately after receiving the token
- [ ] An ora spinner is shown while waiting for authentication
- [ ] Success message is printed in green (chalk) with the authenticated GitHub username
- [ ] If the user is already logged in, a message indicates this and offers to re-authenticate

### Link Command

- [ ] `gblockparty link` requires authentication (exits with message if not logged in)
- [ ] Fetches the list of projects from `GET /api/projects`
- [ ] Presents an interactive selection list (inquirer) showing project names
- [ ] Saves the selected project ID to `.gblockparty/config.json` in the current directory
- [ ] Creates the `.gblockparty/` directory if it does not exist
- [ ] Prints confirmation with the linked project name and ID
- [ ] If no projects exist, prints a message directing the user to the dashboard

### Deploy Command

- [ ] `gblockparty deploy` requires authentication and a linked project
- [ ] Reads the current git branch and commit SHA from the local git repo
- [ ] Sends `POST /api/cli/deploy` with project ID, branch, commit SHA, and production flag
- [ ] Supports `--prod` flag to trigger a production deployment (default is preview)
- [ ] Supports `--branch` flag to override the detected branch
- [ ] Streams build logs in real-time from the server (via WebSocket or SSE)
- [ ] Shows an ora spinner with status updates during build phases
- [ ] On success, prints the deployment URL in green
- [ ] On failure, prints the error message in red with build log context

### Env Commands

- [ ] `gblockparty env pull` downloads env vars from the API and writes them to `.env.local`
- [ ] Supports `-s/--scope` option to select `production` or `preview` scope (defaults to `production`)
- [ ] Secret values are never written to `.env.local` (they are masked with `***` by the API)
- [ ] Prints a summary of how many variables were written
- [ ] Warns if `.env.local` already exists and asks for confirmation before overwriting
- [ ] `gblockparty env push` reads `.env.local` and uploads vars to the API
- [ ] Supports `-s/--scope` option for scope selection
- [ ] Prints a summary of how many variables were upserted
- [ ] Masks values in terminal output (shows only first 3 characters followed by `***`)

### Logs Command

- [ ] `gblockparty logs` fetches the build log for the latest deployment
- [ ] Supports `-n/--lines` to limit output to the last N lines (default 100)
- [ ] Supports `-f/--follow` for real-time log streaming via WebSocket/SSE
- [ ] Log output preserves ANSI colors from the build process
- [ ] Gracefully handles the case where no deployments exist
- [ ] Prints deployment metadata (commit SHA, status, timestamp) as a header before logs

### Rollback Command

- [ ] `gblockparty rollback` fetches recent deployments from the API
- [ ] Without an argument, presents an interactive list of deployable versions (last 10 successful deployments)
- [ ] Accepts an optional `[deploymentId]` argument to skip interactive selection
- [ ] Shows deployment details in the list: commit SHA (short), branch, timestamp, status
- [ ] Asks for confirmation before executing the rollback
- [ ] Sends `POST /api/projects/:id/deployments/:did/rollback`
- [ ] Prints the rollback result (new deployment URL)

---

## Step Completion Tracking

| Step | Name | Status | Notes |
|------|------|--------|-------|
| 1 | CLI API Routes | Not Started | `/api/cli/deploy`, `/api/cli/env/:projectId` |
| 2 | Login Command | Not Started | Browser OAuth + local callback server |
| 3 | Link Command | Not Started | Interactive project selection |
| 4 | Deploy Command | Not Started | Deploy trigger + log streaming |
| 5 | Env Pull/Push Commands | Not Started | `.env.local` read/write |
| 6 | Logs Command | Not Started | Log viewing + streaming |
| 7 | Rollback Command | Not Started | Interactive rollback selection |

---

## Verification Commands

```bash
# Type-check all packages (should pass with no errors)
pnpm typecheck

# Run tests for CLI package
pnpm --filter @gblockparty/cli test

# Run tests for CLI API routes
pnpm --filter @gblockparty/dashboard test -- --testPathPattern=cli

# Build CLI package
pnpm --filter @gblockparty/cli build

# Manual: test login flow
npx gblockparty login

# Manual: test link flow
cd /path/to/test-project
npx gblockparty link

# Manual: test deploy
npx gblockparty deploy --prod

# Manual: test env pull/push
npx gblockparty env pull -s production
npx gblockparty env push -s production

# Manual: test logs
npx gblockparty logs -n 50
npx gblockparty logs -f

# Manual: test rollback
npx gblockparty rollback

# Verify config files
cat ~/.gblockparty/config.json
cat .gblockparty/config.json
```

---

## Risk Factors

| Risk | Mitigation |
|------|-----------|
| OAuth callback may fail if browser blocks popups or localhost access | Provide manual token entry as fallback; print the OAuth URL so user can open manually |
| Build log streaming may be unreliable over poor network connections | Implement reconnection logic; support non-streaming fallback (poll for completed logs) |
| Interactive prompts (inquirer) may not work in CI/non-TTY environments | Detect non-interactive mode and require all options as flags instead |
| Port conflicts on local callback server for login | Use port 0 (OS-assigned random port) to avoid conflicts |
| `.env.local` may contain sensitive data not tracked by git | Warn user about `.gitignore` requirements; never write actual secret values |
| API rate limits during development and testing | Use the same rate limiting strategy as dashboard; CLI requests are low-volume |

---

## Handoff Notes

When this phase is complete, the following capabilities are fully available:

- **End users**: Can manage their entire deployment lifecycle from the terminal without touching the dashboard
- **CI/CD pipelines**: Can use CLI commands in automated workflows (with `--no-interactive` flags or environment variables for auth)
- **All 6 CLI commands** (`login`, `link`, `deploy`, `env`, `logs`, `rollback`) are functional and production-ready
- The CLI is publishable to npm as the `gblockparty` package
