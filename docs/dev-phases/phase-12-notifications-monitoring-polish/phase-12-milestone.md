# Phase 12: Notifications, Monitoring & Polish -- Milestone Tracker

**Phase:** 12 of 12
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | Slack Webhook Integration | Not Started | `packages/core/src/notifications/notifier.ts` |
| 2 | Discord Webhook Integration | Not Started | `packages/core/src/notifications/notifier.ts` |
| 3 | Notification Settings API & Dashboard UI | Not Started | API route + settings form |
| 4 | Notification Trigger Integration | Not Started | Wire into BuildRunner, Deployer, rollback |
| 5 | Platform Settings Page | Not Started | `apps/dashboard/src/app/settings/page.tsx` |
| 6 | VPS Monitoring & Alerts | Not Started | `packages/core/src/monitoring/vps-monitor.ts` |

---

## Step 1: Slack Webhook Integration

**File:** `packages/core/src/notifications/notifier.ts`
**Status:** Not Started

- [ ] Implement `sendSlackNotification(webhookUrl, payload)` replacing the TODO stub
- [ ] HTTP POST to the Slack webhook URL with JSON body
- [ ] Message format uses Slack Block Kit / attachments
- [ ] Color coding: red (#FF0000) for failures, green (#36a64f) for success, yellow (#FFA500) for rollbacks
- [ ] Fields: project name, event type (build failure / deploy failure / rollback), error message, dashboard link
- [ ] Handle HTTP errors: log and throw on non-200 response
- [ ] Handle network errors: log and throw with descriptive message
- [ ] Timeout: 10 seconds for the HTTP request
- [ ] No sensitive information in notification messages (no passwords, tokens, etc.)
- [ ] Test: verify correct JSON payload sent to webhook URL
- [ ] Test: handle non-200 response gracefully
- [ ] Test: handle network timeout gracefully

---

## Step 2: Discord Webhook Integration

**File:** `packages/core/src/notifications/notifier.ts`
**Status:** Not Started

- [ ] Implement `sendDiscordNotification(webhookUrl, payload)` replacing the TODO stub
- [ ] HTTP POST to the Discord webhook URL with JSON body
- [ ] Message format uses Discord embed objects
- [ ] Color coding: red (0xFF0000) for failures, green (0x36a64f) for success, yellow (0xFFA500) for rollbacks
- [ ] Embed fields: project name, event type, error message, dashboard link
- [ ] Handle HTTP errors: log and throw on non-2xx response
- [ ] Handle network errors: log and throw with descriptive message
- [ ] Timeout: 10 seconds for the HTTP request
- [ ] Discord rate limiting: handle 429 responses with retry-after header
- [ ] Test: verify correct JSON payload sent to webhook URL
- [ ] Test: handle non-2xx response gracefully
- [ ] Test: handle rate limiting (429) gracefully

---

## Step 3: Notification Settings API & Dashboard UI

**Status:** Not Started

### API Route
- [ ] Create `apps/dashboard/src/app/api/settings/notifications/route.ts`
- [ ] GET handler: return current notification settings from `notification_settings` table
- [ ] PUT handler: update notification settings (Zod-validated request body)
- [ ] POST handler (test): send a test notification to verify webhook URL works
- [ ] All routes protected by `withAuth`
- [ ] If no settings exist (first time), GET returns defaults: both URLs null, both toggles true
- [ ] PUT upserts: creates if not exists, updates if exists (single row table)

### Dashboard Form
- [ ] Create `apps/dashboard/src/components/settings/notification-settings.tsx`
- [ ] Slack webhook URL input field with validation
- [ ] Discord webhook URL input field with validation
- [ ] Toggle: "Notify on build/deployment failures" (maps to `notifyOnFailure`)
- [ ] Toggle: "Notify on auto-rollback events" (maps to `notifyOnRollback`)
- [ ] "Save" button with loading state
- [ ] "Test" button next to each webhook URL (sends test notification)
- [ ] Success/error feedback on save and test actions
- [ ] Form pre-populated with current settings (SWR fetch)

---

## Step 4: Notification Trigger Integration

**Status:** Not Started

### BuildRunner Integration
- [ ] On build failure: load notification settings, call `notify()` with build failure payload
- [ ] Payload includes: project name, commit SHA, branch, error message
- [ ] Respects `notifyOnFailure` toggle
- [ ] Notification sent after deployment record is marked FAILED

### Deployer Integration
- [ ] On deploy failure (health check, container crash): load settings, call `notify()`
- [ ] Payload includes: project name, deployment type, error message, dashboard URL
- [ ] Respects `notifyOnFailure` toggle

### Auto-Rollback Integration
- [ ] On auto-rollback trigger: load settings, call `notify()` with rollback payload
- [ ] Payload includes: project name, reason ("crash-loop-detected"), rolled-back-to deployment info
- [ ] Respects `notifyOnRollback` toggle

### General
- [ ] Settings loaded from database using Drizzle query on `notification_settings` table
- [ ] `notify()` handles errors gracefully: one webhook failing doesn't prevent the other
- [ ] Notification errors do not block the build/deploy pipeline (fire-and-forget with logging)
- [ ] No duplicate notifications for the same event

---

## Step 5: Platform Settings Page

**File:** `apps/dashboard/src/app/settings/page.tsx`
**Status:** Not Started (placeholder exists)

### GitHub App Status Section
- [ ] Display GitHub App name and installation status
- [ ] Show connected repositories list (from `github_installations` table)
- [ ] Show current permissions (hardcoded display, matches App configuration)
- [ ] Link to GitHub App settings page for re-configuration

### Notification Preferences Section
- [ ] Embed the notification-settings form component (from Step 3)
- [ ] Pre-populated with current settings

### Platform Info Section
- [ ] Display VPS stats from Step 6 (disk usage, container count, memory)
- [ ] Auto-refresh every 30 seconds using SWR `refreshInterval`
- [ ] Port usage summary (allocated vs. total available)
- [ ] Platform version / build info (commit SHA, build date)

### Layout
- [ ] Three-section layout with clear headings
- [ ] Responsive: single-column on mobile, organized on desktop
- [ ] Consistent styling with rest of dashboard (Tailwind CSS)
- [ ] Loading skeletons for async data

---

## Step 6: VPS Monitoring & Alerts

**File:** `packages/core/src/monitoring/vps-monitor.ts`
**Status:** Not Started

### Monitoring Functions
- [ ] `getDiskUsage()`: parse `df -h /` output, return `{ totalGb, usedGb, availableGb, usagePercent }`
- [ ] `getMemoryUsage()`: parse `free -m` output, return `{ totalMb, usedMb, availableMb, usagePercent }`
- [ ] `getContainerStats()`: parse `docker ps --format` output, return `{ running, stopped, total }`
- [ ] `getPortUsage()`: query `port_allocations` table, return `{ allocated, productionUsed, previewUsed, available }`
- [ ] `getVpsStats()`: aggregate all above into a single response

### API Route
- [ ] Create `apps/dashboard/src/app/api/settings/vps-stats/route.ts`
- [ ] GET handler: call `getVpsStats()` and return the result
- [ ] Protected by `withAuth`
- [ ] Cache response for 10 seconds (avoid running shell commands on every request)

### Alert Thresholds
- [ ] Disk usage > 80%: send notification with disk usage details
- [ ] Memory usage > 90%: send notification with memory details
- [ ] Alert check runs on a schedule (every 5 minutes, via setInterval or cron)
- [ ] Alert debounce: don't send the same alert more than once per hour

### Health Endpoint
- [ ] Create `/api/health` endpoint (no auth required)
- [ ] Returns 200 with `{ status: "ok", uptime: number, timestamp: string }`
- [ ] Optionally include: database connectivity check, disk usage

---

## Completion Checklist

- [ ] All 6 steps completed and individually verified
- [ ] Slack notifications send correctly to webhook URL
- [ ] Discord notifications send correctly to webhook URL
- [ ] Notification settings persist and load correctly
- [ ] Build failures trigger notifications
- [ ] Deployment failures trigger notifications
- [ ] Auto-rollback events trigger notifications
- [ ] Notification toggles respected (can disable failure/rollback notifications)
- [ ] Settings page shows GitHub App status
- [ ] Settings page shows notification preferences form
- [ ] Settings page shows VPS stats (disk, memory, containers)
- [ ] VPS alerts fire when thresholds exceeded
- [ ] Health endpoint returns 200
- [ ] `pnpm typecheck` passes with no errors across all packages
- [ ] Phase 12 spec acceptance criteria all satisfied
- [ ] Platform is production-ready

---

## Notes

_Use this section to record decisions, blockers, or deviations during implementation._
