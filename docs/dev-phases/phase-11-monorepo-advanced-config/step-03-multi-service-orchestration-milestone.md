# Step 3 Milestone: Multi-Service Deployment Orchestration

**Phase:** 11 | **Step:** 3 of 4
**Type:** Backend integration

---

## Checklist

### Webhook Handler Integration
- [ ] Calls `parseConfig(repoPath)` after cloning the repo
- [ ] Calls `getChangedFiles(commits)` to extract changed file list
- [ ] Calls `getAffectedServices(config, changedFiles)` for multi-service configs
- [ ] Skips build when no services affected (sets commit status to success)
- [ ] Loops through affected services and builds/deploys each sequentially
- [ ] Falls back to existing single-service flow when no deploy.yaml

### BuildRunner Modifications
- [ ] `BuildRunnerOptions` extended with `serviceName`, `servicePath`, `serviceType`, `servicePort`, `dockerfile`
- [ ] Build context set to `{repoPath}/{servicePath}` when `servicePath` is provided
- [ ] Image tag format: `{projectSlug}-{serviceName}:{sha}` for multi-service
- [ ] Image tag format: `{projectSlug}:{sha}` for single-service (unchanged)
- [ ] Build cache key includes service name: `{projectId}/{serviceName}/deps/{hash}`
- [ ] `serviceType` overrides auto-detection when provided
- [ ] Backward compatible: works without new fields for single-service

### Deployer Modifications
- [ ] `DeployOptions` extended with `serviceName`, `servicePort`
- [ ] Multi-service hostname: `{serviceName}--{projectSlug}.yourdomain.dev`
- [ ] Single-service hostname: `{projectSlug}.yourdomain.dev` (unchanged)
- [ ] Container port mapping uses `servicePort` (default 3000)
- [ ] CaddyClient receives correct hostname for routing
- [ ] Backward compatible: works without new fields for single-service

### Deployment Records
- [ ] One deployment record per affected service
- [ ] `dockerImageTag` includes service name
- [ ] `url` reflects service-specific hostname
- [ ] Each deployment has independent `status` (one can fail while others succeed)

### URL Generation
- [ ] `generateServiceUrl()` added to `packages/core/src/routing/url.ts`
- [ ] `generateServicePreviewUrl()` added for multi-service preview URLs
- [ ] Preview URL format: `pr-{n}--{service}--{project}.yourdomain.dev`

### Error Handling
- [ ] Failed service build/deploy does not block remaining services
- [ ] Failed service deployment record set to `status: 'failed'` with error message
- [ ] GitHub commit status set per service (separate contexts)
- [ ] Aggregate commit status: success only if all services succeed

### Backward Compatibility
- [ ] Single-service projects (no deploy.yaml) work exactly as before
- [ ] Single-service deploy.yaml projects work correctly
- [ ] No changes to API route contracts
- [ ] No changes to dashboard display for single-service projects

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/github/webhooks.ts` | Modify (add config parsing + multi-service loop) |
| `packages/core/src/build/builder.ts` | Modify (extend options, add service context) |
| `packages/core/src/deploy/deployer.ts` | Modify (extend options, add service hostname) |
| `packages/core/src/routing/url.ts` | Modify (add service URL generators) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| VPS resources insufficient for building multiple services quickly | Sequential builds (MVP); parallel is future optimization |
| GitHub commit status API rate limits with many services | Unlikely at current scale; batch if needed |
| Dashboard may not display multi-service deployments properly | Dashboard changes are Phase 12; for now, each deployment appears as a separate entry |
