# Step 8 Milestone: Docker Image Retention & Cleanup

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 8 of 8

---

## Checklist

### pruneImages Implementation
- [ ] `pruneImages(docker, projectName, keepCount)` implemented
- [ ] Lists images by `{projectName}:*` reference filter
- [ ] Sorted by creation date, newest first
- [ ] Keeps newest `keepCount` images (default: `BUILD_LIMITS.MAX_IMAGES_PER_PROJECT` = 10)
- [ ] Removes older images via `docker.getImage(id).remove()`
- [ ] Skips images in use by running containers
- [ ] Excludes preview images (`pr-*` tags) from production retention counting
- [ ] Returns `{ removed: string[], kept: string[] }`
- [ ] Logs removed and kept image counts

### removePreviewImages Implementation
- [ ] `removePreviewImages(docker, projectName, prNumber)` implemented
- [ ] Removes all images matching `{projectName}:pr-{N}-*`
- [ ] Skips in-use images
- [ ] Returns list of removed image tags

### Integration
- [ ] `pruneImages()` called after each successful production deploy
- [ ] Pruning is fire-and-forget (non-blocking, does not affect deployment)
- [ ] `removePreviewImages()` called on PR close webhook
- [ ] Pruning failure logged as warning, does not crash

### Edge Cases
- [ ] Fewer than `keepCount` images: no-op, returns early
- [ ] In-use images: skipped, logged
- [ ] Image removal error: logged as warning, continues with remaining images
- [ ] Preview images not counted in production retention

### Verification
- [ ] After 11th deploy: oldest production image removed, 10 remain
- [ ] Running container images never removed
- [ ] PR close: all preview images for that PR removed
- [ ] Disk usage remains bounded

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| `pruneImages` implemented | [ ] | |
| `removePreviewImages` implemented | [ ] | |
| Post-deploy integration complete | [ ] | |
| PR close cleanup integrated | [ ] | |
| Edge cases verified | [ ] | |
| **Step 8 complete** | [ ] | |
