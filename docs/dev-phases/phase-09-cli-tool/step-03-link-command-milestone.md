# Step 3 Milestone: Link Command

**Phase:** 9 -- CLI Tool
**Step:** 3 of 7

---

## Checklist

### Authentication Guard

- [ ] Command checks for auth token in global config
- [ ] Exits with code 1 and helpful message if not authenticated
- [ ] Handles expired/invalid token gracefully (API returns 401)

### Project Fetching

- [ ] Calls `GET /api/projects` with Bearer token auth
- [ ] Shows ora spinner while fetching ("Fetching projects...")
- [ ] Handles API errors (network failure, 500, 401) with informative messages

### Interactive Selection

- [ ] Uses `inquirer` `list` prompt to display available projects
- [ ] Each choice shows project name and GitHub repo full name (or slug)
- [ ] Arrow keys navigate the list, Enter selects
- [ ] Handles the case where no projects exist (prints message, exits gracefully)

### Config Persistence

- [ ] Selected project ID is saved to `.gblockparty/config.json` via `saveProjectConfig()`
- [ ] The `.gblockparty/` directory is created automatically if it does not exist
- [ ] Re-linking overwrites the previous project config
- [ ] `getProjectConfig()` returns the correct project ID after linking

### Output

- [ ] Success message shows the linked project name in green
- [ ] Project ID is printed in dim for reference
- [ ] Config file path is printed in dim
- [ ] Warning is shown if `.gblockparty/` is not in `.gitignore`
- [ ] Warning is shown if the directory is already linked (but linking proceeds)

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Auth guard works | [ ] | |
| Project list fetched and displayed | [ ] | |
| Interactive selection works | [ ] | |
| Config saved correctly | [ ] | |
| Edge cases handled | [ ] | |
| **Step 3 complete** | [ ] | |
