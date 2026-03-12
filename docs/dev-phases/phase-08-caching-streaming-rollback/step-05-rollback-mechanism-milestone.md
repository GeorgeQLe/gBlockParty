# Step 5 Milestone: Rollback Mechanism

**Phase:** 8 -- Build Caching, Log Streaming & Rollback
**Step:** 5 of 8

---

## Checklist

### Validation
- [ ] Target deployment fetched from database
- [ ] Validates deployment exists and belongs to project
- [ ] Validates deployment has a `docker_image_tag`
- [ ] Validates Docker image still exists (not pruned)
- [ ] Returns clear error messages for each validation failure

### Deployment Record
- [ ] New deployment record created with `type: 'rollback'`
- [ ] `source_deployment_id` set to the target deployment ID
- [ ] `commit_sha` and `branch` copied from target deployment
- [ ] `docker_image_tag` copied from target deployment
- [ ] Initial status set to `'deploying'`

### Container Management
- [ ] Port allocated from production range (3001-3999)
- [ ] Container started from target deployment's image via `runContainer()`
- [ ] Container name follows naming convention (`{slug}-{deploymentId}`)
- [ ] Environment variables loaded from project configuration

### Health Check
- [ ] HTTP GET to health check path on allocated port
- [ ] Retries up to `HEALTH_CHECK.MAX_RETRIES` (10) times
- [ ] Waits `HEALTH_CHECK.RETRY_INTERVAL_MS` (2s) between retries
- [ ] Health check pass: continue to Caddy update
- [ ] Health check fail (all retries exhausted): deployment marked `failed`

### Traffic Switchover
- [ ] Caddy config updated to route hostname to new container port
- [ ] Previous production container stopped gracefully (SIGTERM, 30s timeout)
- [ ] Previous port allocation released
- [ ] Previous deployment status set to `'archived'`

### Finalization
- [ ] New deployment status updated to `'ready'`
- [ ] `container_id`, `port`, `url` set on new deployment record
- [ ] `projects.production_deployment_id` updated to new deployment ID
- [ ] Function returns the new deployment ID

### Error Handling
- [ ] Pre-validation errors: no deployment record created, error thrown immediately
- [ ] Post-record errors: deployment record updated to `'failed'` with error message
- [ ] Old container stop failure: logged as warning, does not fail the rollback
- [ ] All operations logged via Pino with structured context

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| `rollbackDeployment` implemented | [ ] | |
| Validation logic complete | [ ] | |
| Health check working | [ ] | |
| Traffic switchover verified | [ ] | |
| Error handling tested | [ ] | |
| **Step 5 complete** | [ ] | |
