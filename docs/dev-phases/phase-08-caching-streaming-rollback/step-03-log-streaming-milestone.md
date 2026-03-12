# Step 3 Milestone: WebSocket Log Streaming

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 3 of 8

---

## Checklist

### LogBroadcaster
- [ ] `LogBroadcaster` class implemented in `packages/core/src/build/log-broadcaster.ts`
- [ ] Singleton exported as `logBroadcaster`
- [ ] `emit(deploymentId, line)` buffers event and notifies subscribers
- [ ] `subscribe(deploymentId, onLog, onComplete)` returns unsubscribe function
- [ ] `getBufferedLogs(deploymentId)` returns array of `LogEvent` objects
- [ ] `getFullLog(deploymentId)` returns concatenated log text for S3 upload
- [ ] `complete(deploymentId)` signals build end to all subscribers
- [ ] `clear(deploymentId)` removes buffer and listeners (called after S3 upload)

### BuildRunner Integration
- [ ] `BuildRunner.run()` emits log lines via `logBroadcaster.emit()`
- [ ] Child process stdout/stderr piped line-by-line (not buffered until process exit)
- [ ] Build start, step transitions, and completion logged as distinct events
- [ ] `logBroadcaster.complete()` called on both success and failure
- [ ] Full log uploaded to S3 after build completes
- [ ] `build_log_s3_key` set on deployment record after upload
- [ ] In-memory buffer cleared after S3 upload

### SSE Endpoint
- [ ] GET handler at `.../logs/stream/route.ts` returns `text/event-stream` response
- [ ] Authentication enforced via `getSession()` check
- [ ] Buffered logs replayed on new connection (mid-build clients see prior output)
- [ ] Live events streamed as they arrive from `LogBroadcaster`
- [ ] Each event has `id` field (sequence number) for resume support
- [ ] `Last-Event-ID` header honored -- only events after that sequence are sent
- [ ] `event: complete` sent when build finishes
- [ ] Stream closed after complete event
- [ ] Client disconnect triggers unsubscribe (no memory leak)
- [ ] Keepalive comments sent periodically to prevent timeout

### Error Handling
- [ ] S3 upload failure for logs: logged, does not crash
- [ ] Client disconnect during streaming: cleanup runs, no errors thrown
- [ ] Connection after build completion: immediate redirect to S3 logs or `complete` event

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| LogBroadcaster implemented | [ ] | |
| BuildRunner emits log lines | [ ] | |
| SSE endpoint streams logs | [ ] | |
| Resume via Last-Event-ID works | [ ] | |
| Logs persisted to S3 | [ ] | |
| **Step 3 complete** | [ ] | |
