# Step 5 Milestone: Env Pull/Push Commands

**Phase:** 9 -- CLI Tool
**Step:** 5 of 7

---

## Checklist

### Env Pull

- [ ] `gblockparty env pull` calls `GET /api/cli/env/:projectId?scope={scope}` with auth
- [ ] Downloaded env vars are written to `.env.local` in the current directory
- [ ] Non-secret vars are written as `KEY=VALUE` lines
- [ ] Secret vars are written as comments: `# KEY=*** (secret -- set via dashboard)`
- [ ] File includes header comments with scope and pull timestamp
- [ ] Default scope is `production`
- [ ] `-s preview` flag fetches preview scope variables
- [ ] Overwrite confirmation prompt is shown when `.env.local` already exists
- [ ] `-y/--yes` flag skips the overwrite confirmation
- [ ] Success message shows count of variables written
- [ ] Warning shows count of secrets omitted
- [ ] Handles empty var list (project has no env vars) gracefully

### Env Push

- [ ] `gblockparty env push` reads `.env.local` from the current directory
- [ ] Parsed vars are sent via `POST /api/cli/env/:projectId` with `{ scope, vars }`
- [ ] Comment lines (starting with `#`) are skipped
- [ ] Empty lines are skipped
- [ ] Lines without `=` separator are skipped
- [ ] Quoted values (double or single quotes) have quotes stripped
- [ ] Default scope is `production`
- [ ] `-s preview` flag pushes to preview scope
- [ ] Preview of masked values is printed before pushing
- [ ] Values are masked in terminal output (first 3 chars + `***`)
- [ ] Success message shows count of upserted variables
- [ ] Error message shown if `.env.local` does not exist
- [ ] Graceful handling if `.env.local` is empty or has no valid vars

### Shared

- [ ] Both commands require authentication (exit with message if not logged in)
- [ ] Both commands require a linked project (exit with message if not linked)
- [ ] Invalid scope values are rejected with an error message
- [ ] API errors (401, 404, 500) are handled with informative messages
- [ ] Ora spinners show progress during API calls

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Env pull writes .env.local | [ ] | |
| Secret masking works | [ ] | |
| Env push reads and uploads | [ ] | |
| .env file parsing correct | [ ] | |
| Scope flag works for both | [ ] | |
| Overwrite confirmation works | [ ] | |
| **Step 5 complete** | [ ] | |
