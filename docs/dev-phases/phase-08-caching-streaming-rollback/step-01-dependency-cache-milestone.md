# Step 1 Milestone: S3 Dependency Cache

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 1 of 8

---

## Checklist

### Implementation
- [ ] `saveDepsCache(bucket, projectId, lockfileHash, data)` implemented
- [ ] `restoreDepsCache(bucket, projectId, lockfileHash)` returns `Buffer | null`
- [ ] S3 key format: `{projectId}/deps/{lockfileHash}`
- [ ] Lockfile hash computed as SHA-256 of `pnpm-lock.yaml`
- [ ] Tarball size check: skip upload if exceeds `BUILD_LIMITS.BUILD_CACHE_SIZE_BYTES` (1 GB)
- [ ] Tarball creation: `node_modules/` compressed to `.tar.gz`
- [ ] Tarball extraction: decompresses into working directory

### BuildRunner Integration
- [ ] `BuildRunner.run()` calls `restoreDepsCache()` after cloning, before `pnpm install`
- [ ] Cache hit: tarball extracted to project directory, `pnpm install` verifies quickly
- [ ] Cache miss: falls through to full `pnpm install`
- [ ] `BuildRunner.run()` calls `saveDepsCache()` after successful `pnpm install`
- [ ] Cache only saved when lockfile hash differs from cached hash (avoids redundant uploads)

### Error Handling
- [ ] S3 upload failure: logged as warning, build continues
- [ ] S3 download failure (non-404): logged as warning, full install proceeds
- [ ] Corrupted tarball: extraction error caught, node_modules cleaned, full install proceeds
- [ ] Build never fails due to cache operation errors

### Verification
- [ ] First build for a project: cache miss, full install, cache saved
- [ ] Second build (same lockfile): cache hit, fast install
- [ ] Build after lockfile change: cache miss for new hash, full install, new cache saved
- [ ] Build succeeds when S3 is unreachable (graceful degradation)

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| `saveDepsCache` implemented | [ ] | |
| `restoreDepsCache` implemented | [ ] | |
| BuildRunner integration complete | [ ] | |
| Error handling verified | [ ] | |
| Performance improvement confirmed | [ ] | |
| **Step 1 complete** | [ ] | |
