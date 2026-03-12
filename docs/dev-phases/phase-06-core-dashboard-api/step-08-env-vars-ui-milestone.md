# Step 8 Milestone: Environment Variables Page UI

**Phase:** 6, Step 8
**Status:** Not Started

---

## Checklist

### Page (`apps/dashboard/src/app/projects/[id]/environment/page.tsx`)
- [ ] Converted to client component with SWR data fetching
- [ ] Fetches env vars from `GET /api/projects/:id/env?scope=${scope}`
- [ ] Manages scope state (production/preview) in component state
- [ ] Manages bulk edit mode toggle in component state
- [ ] Calls `mutate()` after all mutations to revalidate SWR cache
- [ ] Shows loading state while fetching
- [ ] Shows error state on API failure
- [ ] Shows empty state: "No environment variables for this scope."

### Scope Toggle Component
- [ ] Created at `apps/dashboard/src/components/env/scope-toggle.tsx`
- [ ] Two buttons: "Production" and "Preview"
- [ ] Active scope has filled dark background
- [ ] Inactive scope has outline/border style
- [ ] Clicking switches scope and triggers data re-fetch

### Add Variable Form
- [ ] Created at `apps/dashboard/src/components/env/add-env-var-form.tsx`
- [ ] Key input with client-side format validation (`^[A-Z_][A-Z0-9_]*$`)
- [ ] Inline validation error for invalid key format
- [ ] Value textarea (multi-line)
- [ ] Secret checkbox
- [ ] Submit button sends POST to `/api/projects/:id/env`
- [ ] Sends correct scope based on current toggle
- [ ] Returns 201: clears form, shows success feedback, revalidates list
- [ ] Returns 409: shows "Variable already exists" error
- [ ] Returns 400: shows Zod validation errors

### Environment Variable List
- [ ] Created at `apps/dashboard/src/components/env/env-var-list.tsx`
- [ ] Displays all env vars for current scope
- [ ] Each row shows key, value (or `***` for secrets), and action buttons

### Environment Variable Row (View/Edit)
- [ ] Created at `apps/dashboard/src/components/env/env-var-row.tsx`
- [ ] **View mode:** shows key, value/mask, lock icon for secrets, Edit and Delete buttons
- [ ] **Edit mode:** inline editing with value textarea, secret checkbox, Save/Cancel
- [ ] Edit mode for non-secrets: value pre-filled with current value
- [ ] Edit mode for secrets: value empty with placeholder text
- [ ] Save sends PATCH to `/api/projects/:id/env/:varId`
- [ ] Empty value field for secret edit: only sends `isSecret` update (omits value)
- [ ] Save success: collapses to view mode, revalidates
- [ ] Save error: inline error message
- [ ] Cancel: collapses without changes

### Delete Confirmation Dialog
- [ ] Created at `apps/dashboard/src/components/env/delete-env-var-dialog.tsx`
- [ ] Shows variable key name in confirmation message
- [ ] "Cancel" closes dialog, no action
- [ ] "Delete" sends DELETE to `/api/projects/:id/env/:varId`
- [ ] Delete success: closes dialog, revalidates list
- [ ] Delete error: shows error in dialog
- [ ] Red delete button styling

### Bulk Edit Mode
- [ ] Created at `apps/dashboard/src/components/env/bulk-edit-mode.tsx`
- [ ] "Bulk Edit" button in page header toggles mode
- [ ] Textarea for pasting KEY=VALUE lines
- [ ] Parser handles:
  - [ ] Comments (lines starting with `#`) ignored
  - [ ] Empty lines ignored
  - [ ] First `=` splits key from value (value can contain `=`)
  - [ ] Leading/trailing whitespace trimmed
  - [ ] Quoted values have quotes stripped
  - [ ] Invalid keys shown as errors
- [ ] Preview count: "X variables to import, Y errors"
- [ ] "Mark all as secret" checkbox
- [ ] "Import" button: sequential POST for each valid line
- [ ] Results: "X imported, Y skipped, Z errors"
- [ ] "Cancel" returns to normal view without importing

### Notifications
- [ ] Success feedback on add/edit/delete (toast or inline message)
- [ ] Error feedback with descriptive messages
- [ ] Feedback auto-dismisses or is dismissible

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Page with SWR and scope state | [ ] | |
| Scope toggle | [ ] | |
| Add variable form | [ ] | |
| Env var list | [ ] | |
| Env var row (view/edit) | [ ] | |
| Delete confirmation | [ ] | |
| Bulk edit mode | [ ] | |
| Secret handling UX | [ ] | |
| Client-side validation | [ ] | |
| All mutation feedback | [ ] | |
| Visual testing complete | [ ] | |
| **Step 8 Complete** | [ ] | |
