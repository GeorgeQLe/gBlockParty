# Step 7 Milestone: Auto-Rollback on Crash-Loop

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 7 of 8

---

## Checklist

### CrashLoopDetector
- [ ] `CrashLoopDetector` class created in `packages/core/src/deploy/crash-monitor.ts`
- [ ] `start()` subscribes to Docker container `die` events
- [ ] Event stream reconnects on error (5-second delay)
- [ ] In-memory crash records track per-container crash timestamps
- [ ] Sliding window: crashes older than `CRASH_WINDOW_MS` (5 min) are pruned

### Crash Detection
- [ ] Non-zero exit codes counted as crashes
- [ ] Exit code 0 (graceful shutdown) ignored
- [ ] Only active production deployments monitored (not preview, not archived)
- [ ] Non-platform containers ignored (no matching deployment record)
- [ ] Threshold: `HEALTH_CHECK.CRASH_THRESHOLD` (3) crashes in window

### Auto-Rollback Trigger
- [ ] Crashed deployment marked `status: 'failed'`, `error_message: 'crash-loop-detected'`
- [ ] Previous archived deployment found (most recent by `created_at`)
- [ ] `rollbackDeployment()` called with previous deployment as target
- [ ] Auto-rollback success: logged, notification sent
- [ ] Auto-rollback failure: logged, notification sent with failure details
- [ ] No previous deployment: logged, notification sent, no rollback attempted

### Notifications
- [ ] Slack webhook notification sent (if configured)
- [ ] Discord webhook notification sent (if configured)
- [ ] Message includes: project name, crashed deployment ID, rollback target
- [ ] Notification failure does not crash the monitor

### Safety
- [ ] Cooldown mechanism: 10-minute suppression after auto-rollback per project
- [ ] Prevents infinite rollback loops
- [ ] Cooldown logged when suppressing a rollback

### Platform Integration
- [ ] Detector started on platform boot (instrumentation hook or separate process)
- [ ] Docker restart policy set to `on-failure` with `MaximumRetryCount: 3` on all containers

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| CrashLoopDetector implemented | [ ] | |
| Crash counting and window logic | [ ] | |
| Auto-rollback triggers correctly | [ ] | |
| Notifications working | [ ] | |
| Cooldown mechanism in place | [ ] | |
| **Step 7 complete** | [ ] | |
