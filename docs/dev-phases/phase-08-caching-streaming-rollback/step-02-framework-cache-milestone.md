# Step 2 Milestone: S3 Framework Build Cache

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 2 of 8

---

## Checklist

### Implementation
- [ ] `saveBuildCache(bucket, projectId, branch, data)` implemented
- [ ] `restoreBuildCache(bucket, projectId, branch)` returns `Buffer | null`
- [ ] S3 key format: `{projectId}/build/{branch}`
- [ ] Only caches `.next/cache/` for `nextjs` framework type
- [ ] Skips cache for `dockerfile` and `static` framework types
- [ ] Tarball size check: skip upload if exceeds `BUILD_LIMITS.BUILD_CACHE_SIZE_BYTES` (1 GB)
- [ ] Handles missing `.next/cache/` gracefully (no cache saved)

### BuildRunner Integration
- [ ] `BuildRunner.run()` calls `restoreBuildCache()` before `pnpm build` (for Next.js only)
- [ ] Cache hit: `.next/cache/` extracted into project directory before build
- [ ] Cache miss: cold build proceeds normally
- [ ] `BuildRunner.run()` calls `saveBuildCache()` after successful build (for Next.js only)
- [ ] Cache always overwritten on successful build (latest cache replaces previous)

### S3 Lifecycle Rule
- [ ] Lifecycle rule configured on the S3 bucket
- [ ] Objects expire after 7 days
- [ ] Rule applies to all cache objects (deps and build prefixes)

### Error Handling
- [ ] S3 upload failure: logged, build continues
- [ ] S3 download failure: logged, cold build proceeds
- [ ] Corrupted tarball extraction: caught, cold build proceeds
- [ ] Build never fails due to cache operations

### Verification
- [ ] First build: cache miss, cold build, cache saved
- [ ] Second build (same branch, minor change): cache hit, faster incremental build
- [ ] Different branch: separate cache key, independent cache lifecycle
- [ ] Non-Next.js project: cache functions not called

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| `saveBuildCache` implemented | [ ] | |
| `restoreBuildCache` implemented | [ ] | |
| BuildRunner integration complete | [ ] | |
| S3 lifecycle rule configured | [ ] | |
| Incremental build speedup confirmed | [ ] | |
| **Step 2 complete** | [ ] | |
