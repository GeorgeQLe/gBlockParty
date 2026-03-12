# Step 3 Milestone: Notification Settings API & Dashboard UI

**Phase:** 12 | **Step:** 3 of 6
**Type:** API + Frontend implementation

---

## Checklist

### API: GET `/api/settings/notifications`
- [ ] Returns default settings when no row exists in `notification_settings` table
- [ ] Returns stored settings when row exists
- [ ] Protected by `withAuth`

### API: PUT `/api/settings/notifications`
- [ ] Validates request body with Zod schema
- [ ] Creates new row when none exists (upsert)
- [ ] Updates existing row with provided fields
- [ ] Accepts null for webhook URLs (clears them)
- [ ] Returns updated settings
- [ ] Protected by `withAuth`

### API: POST `/api/settings/notifications/test`
- [ ] Validates request body: `{ type: "slack" | "discord", webhookUrl: string }`
- [ ] Calls `sendSlackNotification()` for type "slack"
- [ ] Calls `sendDiscordNotification()` for type "discord"
- [ ] Returns success message on 200/204 from webhook
- [ ] Returns error message if webhook call fails
- [ ] Protected by `withAuth`

### Dashboard Form Component
- [ ] Created at `apps/dashboard/src/components/settings/notification-settings.tsx`
- [ ] SWR fetch of current settings on mount
- [ ] Slack webhook URL input field
- [ ] Discord webhook URL input field
- [ ] "Notify on failure" toggle (checkbox/switch)
- [ ] "Notify on rollback" toggle (checkbox/switch)
- [ ] "Save Settings" button with loading state
- [ ] Success/error feedback after save
- [ ] "Test" button next to each webhook URL
- [ ] Test button shows loading -> success/error states
- [ ] URL validation warnings for non-standard patterns
- [ ] Empty URL fields treated as null

### Tests
- [ ] GET returns defaults for empty table
- [ ] PUT creates and updates settings
- [ ] PUT rejects invalid URL formats
- [ ] Test endpoint verifies working webhook
- [ ] Test endpoint reports non-working webhook
- [ ] Form saves and loads correctly

---

## Artifacts

| File | Action |
|------|--------|
| `apps/dashboard/src/app/api/settings/notifications/route.ts` | Create |
| `apps/dashboard/src/app/api/settings/notifications/test/route.ts` | Create |
| `apps/dashboard/src/components/settings/notification-settings.tsx` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Single-row table pattern may cause race conditions on concurrent updates | Unlikely for single-user platform; use `updatedAt` for optimistic locking if needed |
| Webhook URL may become invalid after save (Slack/Discord token rotation) | Test button allows verification at any time |
