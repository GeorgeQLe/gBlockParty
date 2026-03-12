# Step 4 Milestone: Notification Trigger Integration

**Phase:** 12 | **Step:** 4 of 6
**Type:** Backend integration

---

## Checklist

### Helper Functions
- [ ] `sendFailureNotification()` created (loads settings, checks toggle, calls notify)
- [ ] `sendRollbackNotification()` created (loads settings, checks toggle, calls notify)
- [ ] `loadNotificationSettings()` queries single row from `notification_settings` table
- [ ] All helpers catch and log errors internally (fire-and-forget)

### BuildRunner Integration
- [ ] `sendFailureNotification()` called in BuildRunner catch block
- [ ] Called after deployment record marked as FAILED
- [ ] Payload includes: project name, "production"/"preview", error message, dashboard URL
- [ ] Notification failure does not re-throw (pipeline continues)
- [ ] Error logged if notification fails

### Deployer Integration
- [ ] `sendFailureNotification()` called in Deployer catch block
- [ ] Called after deployment record marked as FAILED
- [ ] Payload includes: project name, deployment type, error message, dashboard URL
- [ ] Notification failure does not re-throw
- [ ] Error logged if notification fails

### Auto-Rollback Integration
- [ ] `sendRollbackNotification()` called after rollback completes
- [ ] Payload includes: project name, "crash-loop-detected", rolled-back-to commit SHA
- [ ] Notification failure does not re-throw
- [ ] Error logged if notification fails

### Toggle Logic
- [ ] `notifyOnFailure: false` skips build/deploy failure notifications
- [ ] `notifyOnRollback: false` skips rollback notifications
- [ ] Missing settings row (no configuration): silently skip all notifications
- [ ] Null webhook URLs: skip that channel, notify the other if configured

### Tests
- [ ] Build failure triggers Slack notification (when configured)
- [ ] Deploy failure triggers Discord notification (when configured)
- [ ] Rollback triggers both Slack and Discord (when both configured)
- [ ] Toggle off skips notification
- [ ] No settings row -> no notifications -> no errors
- [ ] Notification failure logged but doesn't affect pipeline

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/notifications/notifier.ts` | Modify (add sendFailureNotification, sendRollbackNotification, loadNotificationSettings) |
| `packages/core/src/build/builder.ts` | Modify (add notification call in catch block) |
| `packages/core/src/deploy/deployer.ts` | Modify (add notification call in catch block) |
| `packages/core/src/deploy/rollback.ts` | Modify (add notification call after rollback) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| BuildRunner and Deployer are still TODO stubs | Can add the notification call structure now; it will activate when the stubs are implemented |
| Database query for settings adds latency to failure path | Settings query is fast (<10ms); notification itself is async and doesn't block |
| Circular dependency: notifier imports from db schema | Acceptable; the notifier module already imports from shared |
