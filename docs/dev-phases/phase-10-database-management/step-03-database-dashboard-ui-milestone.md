# Step 3 Milestone: Database Management Dashboard UI

**Phase:** 10 | **Step:** 3 of 4
**Type:** Frontend implementation

---

## Checklist

### Page States
- [ ] Loading state: skeleton UI while data fetches
- [ ] No database state: "Create Database" CTA with description
- [ ] Database exists state: full info panel with stats
- [ ] Error state: error alert with retry button

### Create Database Flow
- [ ] "Create Database" button visible when no database exists
- [ ] Clicking opens confirmation dialog with database name preview
- [ ] Dialog explains what will happen (database creation, DATABASE_URL auto-set)
- [ ] Confirm button calls `POST /api/projects/:id/database`
- [ ] Loading spinner on confirm button during API call
- [ ] Success: dialog closes, SWR revalidates, database info appears
- [ ] Error: message displayed in dialog, dialog stays open

### Database Info Panel
- [ ] Displays database name (`app_{slug}`)
- [ ] Displays database user
- [ ] Displays connection string (see Step 4 for details)
- [ ] Displays database size in human-readable format (KB/MB/GB)
- [ ] Displays active connection count
- [ ] Displays creation date (formatted with `Intl.DateTimeFormat`)
- [ ] Info badge: "DATABASE_URL is set for production and preview"

### Delete Database Flow
- [ ] "Delete Database" button in Danger Zone section
- [ ] Clicking opens double-confirmation dialog
- [ ] Warning about irreversible action displayed
- [ ] Text input: "Type the database name to confirm"
- [ ] Delete button disabled until input matches database name exactly
- [ ] Confirm calls `DELETE /api/projects/:id/database` with `{ confirmName }`
- [ ] Loading spinner on delete button during API call
- [ ] Success: dialog closes, SWR revalidates, page shows "Create Database" state
- [ ] Error: message displayed in dialog, dialog stays open

### Components
- [ ] `database-panel.tsx` created at `apps/dashboard/src/components/database/`
- [ ] `connection-string.tsx` created at `apps/dashboard/src/components/database/`
- [ ] `create-database-dialog.tsx` created at `apps/dashboard/src/components/database/`
- [ ] `delete-database-dialog.tsx` created at `apps/dashboard/src/components/database/`

### Data Fetching
- [ ] SWR hook with proper key: `/api/projects/${projectId}/database`
- [ ] Revalidation triggered after create and delete operations via `mutate()`
- [ ] Fetcher handles auth (includes credentials/cookies)

### Styling & UX
- [ ] Tailwind CSS classes consistent with existing dashboard
- [ ] Responsive layout (mobile-friendly)
- [ ] Monospace font for connection string
- [ ] Danger zone uses destructive color scheme
- [ ] Dialogs use existing modal component pattern

---

## Artifacts

| File | Action |
|------|--------|
| `apps/dashboard/src/app/projects/[id]/database/page.tsx` | Modify (replace placeholder) |
| `apps/dashboard/src/components/database/database-panel.tsx` | Create |
| `apps/dashboard/src/components/database/connection-string.tsx` | Create |
| `apps/dashboard/src/components/database/create-database-dialog.tsx` | Create |
| `apps/dashboard/src/components/database/delete-database-dialog.tsx` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Existing dialog/modal component may not exist yet | Create a simple dialog component or use `<dialog>` element with Tailwind |
| SWR may not be installed in the dashboard | Verify `swr` is in `apps/dashboard/package.json`; install if needed |
| Clipboard API not available in insecure contexts | Use `navigator.clipboard.writeText()` with try/catch fallback |
