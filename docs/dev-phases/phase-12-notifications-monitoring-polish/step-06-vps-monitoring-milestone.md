# Step 6 Milestone: VPS Monitoring & Alerts

**Phase:** 12 | **Step:** 6 of 6
**Type:** Backend implementation + API

---

## Checklist

### Monitoring Functions
- [ ] `getDiskUsage()` parses `df` output, returns `{ totalGb, usedGb, availableGb, usagePercent }`
- [ ] `getMemoryUsage()` parses `free` output, returns `{ totalMb, usedMb, availableMb, usagePercent }`
- [ ] `getContainerStats()` parses `docker ps` output, returns `{ running, stopped, total }`
- [ ] `getPortUsage()` queries `port_allocations` table, returns `{ allocated, productionUsed, previewUsed, available }`
- [ ] `getVpsStats()` aggregates all into single response
- [ ] Shell command timeout set to 5 seconds
- [ ] Shell command failures return zeroed defaults (no crashes)
- [ ] Works on Linux VPS; degrades gracefully on macOS (development)

### API Route: VPS Stats
- [ ] Created at `apps/dashboard/src/app/api/settings/vps-stats/route.ts`
- [ ] GET returns VPS stats JSON
- [ ] Response cached for 10 seconds (in-memory)
- [ ] Protected by `withAuth`

### Alert System
- [ ] `checkAndAlert()` checks disk and memory thresholds
- [ ] Disk > 80% triggers notification
- [ ] Memory > 90% triggers notification
- [ ] Alert messages include percentage and absolute values
- [ ] Alert messages suggest remediation (cleanup, stop containers)
- [ ] Alert debounce: same alert type not sent more than once per hour
- [ ] Alert runs on periodic schedule (every 5 minutes)
- [ ] Alert errors logged but don't crash the process

### Health Endpoint
- [ ] Created at `apps/dashboard/src/app/api/health/route.ts`
- [ ] Returns 200 with `{ status, uptime, uptimeHuman, timestamp, version }`
- [ ] No authentication required
- [ ] `version` sourced from environment variable or "development"

### Barrel Exports
- [ ] `packages/core/src/monitoring/index.ts` created
- [ ] All functions and types exported

### Tests
- [ ] `getDiskUsage()` parses expected `df` output correctly
- [ ] `getMemoryUsage()` parses expected `free` output correctly
- [ ] `getContainerStats()` counts running and stopped containers
- [ ] `getPortUsage()` returns correct allocation counts
- [ ] Shell command failure returns zeroed defaults
- [ ] Alert fires when threshold exceeded
- [ ] Alert debounce prevents duplicate alerts
- [ ] Health endpoint returns 200

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/monitoring/vps-monitor.ts` | Create |
| `packages/core/src/monitoring/index.ts` | Create |
| `apps/dashboard/src/app/api/settings/vps-stats/route.ts` | Create |
| `apps/dashboard/src/app/api/health/route.ts` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Shell commands don't work on macOS for local development | Return zeroed defaults; real monitoring only on VPS |
| `docker ps` requires Docker socket access | Dashboard container must have Docker socket mounted |
| Alert spam if threshold is hovering around the boundary | Debounce: 1 hour between same alert type |
| `setInterval` for alert checks may not survive Next.js hot reloads | Use Next.js instrumentation hook or a separate process for production |
