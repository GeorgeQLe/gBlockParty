# Step 5 Milestone: Platform Settings Page

**Phase:** 12 | **Step:** 5 of 6
**Type:** Frontend implementation

---

## Checklist

### Page Structure
- [ ] Placeholder at `apps/dashboard/src/app/settings/page.tsx` replaced with full implementation
- [ ] Page heading: "Settings"
- [ ] Three sections: GitHub App, Notifications, Platform Info
- [ ] Sections organized in cards with headings

### GitHub App Status Section
- [ ] Component created: `apps/dashboard/src/components/settings/github-status.tsx`
- [ ] API route created: `apps/dashboard/src/app/api/settings/github/route.ts`
- [ ] Connection status badge (green "Connected" / red "Not Connected")
- [ ] Account login displayed
- [ ] Repository count displayed
- [ ] Permissions list displayed (hardcoded, matching App config)
- [ ] "Manage on GitHub" link opens installation settings page
- [ ] Handles no installation (shows "Not Connected" with setup instructions)

### Notification Settings Section
- [ ] Embeds `notification-settings.tsx` component from Step 3
- [ ] Form loads current settings
- [ ] Save and test functionality works within the settings page context

### Platform Info Section
- [ ] Component created: `apps/dashboard/src/components/settings/vps-stats-panel.tsx`
- [ ] Disk usage: progress bar + percentage + absolute values
- [ ] Memory usage: progress bar + percentage + absolute values
- [ ] Container count: running / stopped
- [ ] Port allocation: allocated with production/preview breakdown
- [ ] Progress bar color coding: green -> yellow -> red based on thresholds
- [ ] Auto-refresh every 30 seconds via SWR `refreshInterval`
- [ ] Platform version and build date displayed

### Data Fetching
- [ ] SWR fetch for `/api/settings/github`
- [ ] SWR fetch for `/api/settings/notifications`
- [ ] SWR fetch for `/api/settings/vps-stats` with 30s refresh
- [ ] Each section loads independently
- [ ] Loading skeletons for each section

### Styling
- [ ] Consistent with dashboard design (Tailwind CSS)
- [ ] Responsive layout (mobile-friendly)
- [ ] Cards with borders, rounded corners, subtle shadow
- [ ] Proper spacing between sections

---

## Artifacts

| File | Action |
|------|--------|
| `apps/dashboard/src/app/settings/page.tsx` | Modify (replace placeholder) |
| `apps/dashboard/src/app/api/settings/github/route.ts` | Create |
| `apps/dashboard/src/components/settings/github-status.tsx` | Create |
| `apps/dashboard/src/components/settings/vps-stats-panel.tsx` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| VPS stats endpoint not ready (Step 6) | Page can render without stats section; add graceful fallback |
| GitHub installations table may be empty | Handle null installation state with "Not Connected" message |
| Too many SWR requests on page load | Three concurrent requests is acceptable; they're all lightweight |
