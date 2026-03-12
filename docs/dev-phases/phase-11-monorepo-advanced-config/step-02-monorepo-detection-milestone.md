# Step 2 Milestone: Monorepo Service Detection

**Phase:** 11 | **Step:** 2 of 4
**Type:** Backend implementation

---

## Checklist

### getChangedFiles(commits)
- [ ] Extracts `added`, `modified`, `removed` files from all commits
- [ ] Deduplicates file paths across commits
- [ ] Returns `string[]` of unique file paths
- [ ] Handles empty commits array (returns empty array)

### getAffectedServices(config, changedFiles)
- [ ] Single-service config: returns the service with all changed files, reason `"direct"`
- [ ] Multi-service: categorizes files by matching against service `path` prefixes
- [ ] Files matching a service path: service is affected with reason `"direct"`
- [ ] Files outside all service paths: ALL services affected, reason `"shared"`
- [ ] Mixed direct + shared changes: all services affected, direct ones get combined file lists
- [ ] Empty changed files: returns empty array (no services affected)
- [ ] Service `path: "."` matches all files
- [ ] Trailing slashes in paths handled correctly
- [ ] Overlapping paths: most specific path matches first (sorted by length)

### Types
- [ ] `AffectedService` interface exported: `{ service, changedFiles, reason }`
- [ ] `PushCommit` interface exported: `{ id, added, modified, removed }`
- [ ] `reason` is `"direct" | "shared"`

### Tests
- [ ] Change in `apps/web/` only affects `web` service
- [ ] Change in `services/api/` only affects `api` service
- [ ] Change in root `pnpm-lock.yaml` affects all services
- [ ] Change in `packages/shared/` (non-service directory) affects all services
- [ ] Changes in multiple service dirs affect those services
- [ ] Single-service config always returns affected
- [ ] Empty commits -> empty affected
- [ ] Overlapping paths resolved correctly

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/build/monorepo.ts` | Create |
| `packages/core/src/build/index.ts` | Modify (add exports) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| GitHub webhook payload may not include file lists for large pushes | GitHub truncates commit lists for pushes with >20 commits; fallback: rebuild all services |
| Path matching edge cases with Windows-style paths | Normalize all paths to forward slashes; GitHub always uses forward slashes |
