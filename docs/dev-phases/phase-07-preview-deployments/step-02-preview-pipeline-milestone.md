# Step 2 Milestone: Preview Deployment Pipeline

**Phase:** 7 -- Preview Deployments
**Step:** 2 of 5
**Status:** Not Started

---

## Acceptance Criteria

- [ ] `PreviewDeployer` class exists at `packages/core/src/deploy/preview-deployer.ts`
- [ ] Docker image built and tagged as `{slug}:pr-{N}-{sha7}`
- [ ] Port allocated from preview range (4000-4999)
- [ ] Container started with preview-scope env vars (not production)
- [ ] Health check passes before Caddy routing (10 retries, 2s interval)
- [ ] Caddy route added: `pr-{N}--{slug}.{domain}` -> `localhost:{port}`
- [ ] Deployment record updated to `ready` with all fields set
- [ ] Previous preview container for same PR is stopped and archived
- [ ] Build failure results in `status='failed'` with error message
- [ ] Failed deployments clean up allocated resources (port, container)
- [ ] `startPreviewBuild()` orchestrator integrates deployer with commit status and PR comments

---

## Pipeline Step Verification

| Pipeline Step | Expected Behavior | Verified |
|---------------|-------------------|----------|
| Status -> `building` | Deployment record updated before build starts | [ ] |
| Docker build | Image tagged `{slug}:pr-{N}-{sha7}` | [ ] |
| Load env vars | Preview-scope env vars fetched from DB | [ ] |
| Stop previous preview | Old container stopped, port released, deployment archived | [ ] |
| Status -> `deploying` | Deployment record updated before container start | [ ] |
| Port allocation | Port in 4000-4999 range, recorded in `port_allocations` | [ ] |
| Container start | Container running with correct image, env, port mapping | [ ] |
| Health check | Retries up to 10x, 2s between attempts | [ ] |
| Caddy route | Preview hostname routes to container port | [ ] |
| Status -> `ready` | All fields set: `url`, `port`, `containerId`, `dockerImageTag`, `buildDurationMs` | [ ] |

---

## Error Path Verification

| Failure Scenario | Expected Cleanup | Verified |
|-----------------|------------------|----------|
| Build fails | Deployment -> `failed`, no port allocated, no container | [ ] |
| Port allocation fails | Deployment -> `failed`, no container started | [ ] |
| Container start fails | Port released, deployment -> `failed` | [ ] |
| Health check fails | Container stopped, port released, deployment -> `failed` | [ ] |
| Caddy route fails | Container stopped, port released, deployment -> `failed` | [ ] |
| DB update fails | Resources cleaned up, error logged | [ ] |

---

## Deployment Record Fields (After Success)

| Field | Expected Value | Verified |
|-------|---------------|----------|
| `status` | `'ready'` | [ ] |
| `docker_image_tag` | `{slug}:pr-{N}-{sha7}` | [ ] |
| `container_id` | Docker container ID (64-char hex) | [ ] |
| `port` | Number in 4000-4999 range | [ ] |
| `url` | `https://pr-{N}--{slug}.{domain}` | [ ] |
| `build_duration_ms` | Positive integer (milliseconds) | [ ] |
| `error_message` | `null` | [ ] |

---

## Container Configuration Verification

| Setting | Expected Value | Verified |
|---------|---------------|----------|
| Image | `{slug}:pr-{N}-{sha7}` | [ ] |
| Name | `{slug}-pr-{N}` | [ ] |
| Port mapping | `{hostPort}:3000` | [ ] |
| Network | `gblockparty` | [ ] |
| Restart policy | `unless-stopped` | [ ] |
| Labels | `gblockparty.type=preview`, `gblockparty.project={slug}`, `gblockparty.pr={N}` | [ ] |
| Env file | Temporary file with preview-scope vars, deleted after start | [ ] |

---

## Previous Preview Handling

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| First commit to new PR | No previous preview to stop | [ ] |
| Second commit to same PR | Previous container stopped, port released, deployment archived | [ ] |
| Multiple rapid commits | Only most recent deployment succeeds, earlier ones cleaned up | [ ] |
| Previous preview already failed | No container to stop, skip gracefully | [ ] |

---

## Sign-Off

| Criteria | Met | Notes |
|----------|-----|-------|
| PreviewDeployer completes full pipeline | [ ] | |
| All success-path fields set correctly | [ ] | |
| All failure paths clean up resources | [ ] | |
| Previous preview replaced cleanly | [ ] | |
| Preview URL accessible in browser | [ ] | |
| **Step 2 Complete** | [ ] | |
