# Step 4 Milestone: Build Log Retrieval

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 4 of 8

---

## Checklist

### Implementation
- [ ] GET handler implemented in `.../logs/route.ts`
- [ ] Deployment record fetched from database
- [ ] Project ownership validated (deploymentId belongs to projectId)
- [ ] `build_log_s3_key` read from deployment record
- [ ] `downloadFromS3()` called to fetch log content
- [ ] Response includes `deploymentId`, `status`, `logs`, `buildDurationMs`
- [ ] ANSI color codes preserved in response (no stripping)

### Error Responses
- [ ] 404 returned when deployment not found
- [ ] 404 returned when deployment has no logs (status=queued or missing S3 key)
- [ ] 409 returned when build is in progress (direct client to streaming endpoint)
- [ ] 404 returned when S3 object is missing (log file deleted)

### Authentication
- [ ] `withAuth` wrapper enforces session authentication
- [ ] Unauthenticated requests return 401

### Dashboard Integration
- [ ] Deployment detail page renders stored logs with ANSI color support
- [ ] Page logic switches between live streaming (in-progress) and stored retrieval (complete)

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| GET endpoint implemented | [ ] | |
| Error cases handled | [ ] | |
| ANSI codes preserved | [ ] | |
| Dashboard renders colored logs | [ ] | |
| **Step 4 complete** | [ ] | |
