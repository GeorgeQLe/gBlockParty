# Phase 11: Monorepo & Advanced Configuration -- Milestone Tracker

**Phase:** 11 of 12
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | deploy.yaml Parser & Validator | Not Started | `packages/core/src/build/config-parser.ts` |
| 2 | Monorepo Service Detection | Not Started | `packages/core/src/build/monorepo.ts` |
| 3 | Multi-Service Deployment Orchestration | Not Started | Integration with BuildRunner + Deployer |
| 4 | Backend Service Deployment | Not Started | `type: dockerfile` support |

---

## Step 1: deploy.yaml Parser & Validator

**File:** `packages/core/src/build/config-parser.ts`
**Status:** Not Started

- [ ] Implement `ConfigParser.parse(repoPath)` that reads `deploy.yaml` from repo root
- [ ] Use `yaml` npm package to parse YAML into JS object
- [ ] Validate with `deployYamlSchema` from `@gblockparty/shared/validation`
- [ ] Handle single-service config (top-level `type` field): normalize to `DeployConfig` with one service
- [ ] Handle multi-service config (`services` map): normalize to `DeployConfig` with multiple services
- [ ] Return `null` when `deploy.yaml` does not exist (triggers fallback to auto-detection)
- [ ] Throw descriptive `ConfigValidationError` for invalid YAML or schema violations
- [ ] Set default values from Zod schema (port: 3000, healthCheck.path: "/")
- [ ] Merge with project-level dashboard overrides (build command, output dir) when applicable
- [ ] Test: valid single-service deploy.yaml parsed correctly
- [ ] Test: valid multi-service deploy.yaml parsed correctly
- [ ] Test: missing deploy.yaml returns null
- [ ] Test: invalid YAML throws ConfigValidationError with details
- [ ] Test: schema violations (e.g., invalid type) throw with field-level errors

---

## Step 2: Monorepo Service Detection

**File:** `packages/core/src/build/monorepo.ts`
**Status:** Not Started

- [ ] Implement `getAffectedServices(config, changedFiles)` function
- [ ] `changedFiles` is an array of file paths from the GitHub push webhook payload
- [ ] For single-service configs: always return the single service as affected
- [ ] For multi-service configs: match changed files against each service's `path` prefix
- [ ] A service is affected if any changed file starts with `{service.path}/`
- [ ] Files outside ALL service paths (shared/root files) trigger rebuild of ALL services
- [ ] Handle edge cases: service path with trailing slash, nested paths
- [ ] Return `AffectedService[]` with service name, config, and list of changed files
- [ ] Implement `getChangedFilesFromCommits(commits)` helper to extract file lists from webhook payload
- [ ] Test: change in `apps/web/` only affects `web` service
- [ ] Test: change in `services/api/` only affects `api` service
- [ ] Test: change in root `package.json` affects all services
- [ ] Test: change in `packages/shared/` (not a service path) affects all services
- [ ] Test: single-service config always returns as affected

---

## Step 3: Multi-Service Deployment Orchestration

**Status:** Not Started

- [ ] Extend webhook handler to call `ConfigParser.parse()` before building
- [ ] For multi-service configs, call `getAffectedServices()` with changed files
- [ ] For each affected service, create a separate deployment record in the database
- [ ] Docker image tag per service: `{project}-{serviceName}:{commitSha}`
- [ ] Build each service with the correct working directory (`service.path` subdirectory)
- [ ] Deploy each service with its own port allocation
- [ ] Multi-service hostname pattern: `{serviceName}--{project}.yourdomain.dev`
- [ ] Single-service hostname pattern (unchanged): `{project}.yourdomain.dev`
- [ ] Sequential build/deploy for MVP (parallel is future optimization)
- [ ] If one service build fails, continue with remaining services
- [ ] Report per-service status in GitHub commit status checks
- [ ] Update Caddy routing for each service independently
- [ ] Build cache key includes service name: `{projectId}/{serviceName}/deps/{hash}`
- [ ] Test: multi-service push builds and deploys affected services
- [ ] Test: each service accessible at its hostname
- [ ] Test: failed service does not block other services
- [ ] Test: single-service projects still work (backward compatible)

---

## Step 4: Backend Service Deployment

**Status:** Not Started

- [ ] Support `type: dockerfile` in deploy.yaml and auto-detection
- [ ] For `dockerfile` type: use user-provided Dockerfile (no auto-generation)
- [ ] Resolve Dockerfile path: `{service.path}/{service.dockerfile}` (default: `Dockerfile`)
- [ ] Validate Dockerfile exists before starting build
- [ ] Build with `docker build -f {dockerfilePath} {contextPath}`
- [ ] Support custom `port` in deploy.yaml (expose that port in the container)
- [ ] Support custom `healthCheck.path` in deploy.yaml
- [ ] Map container's internal port to the allocated host port: `-p {hostPort}:{servicePort}`
- [ ] Integrate with `detectFramework()` fallback: if repo root has Dockerfile but no deploy.yaml, treat as `type: dockerfile`
- [ ] Pass `resources.memory` to `docker run --memory` if specified (optional, nice-to-have)
- [ ] Test: Dockerfile service builds with user Dockerfile
- [ ] Test: custom port is correctly mapped
- [ ] Test: custom health check path is used
- [ ] Test: missing Dockerfile throws descriptive error
- [ ] Test: fallback detection finds Dockerfile when no deploy.yaml exists

---

## Completion Checklist

- [ ] All 4 steps completed and individually verified
- [ ] `deploy.yaml` parsing works for single-service and multi-service configs
- [ ] Monorepo detection correctly identifies affected services
- [ ] Multi-service deployments produce separate containers and hostnames
- [ ] Backend services with custom Dockerfiles build and deploy correctly
- [ ] Single-service projects continue to work (no regressions)
- [ ] Build cache includes service name for multi-service projects
- [ ] Caddy routing handles multi-service hostnames
- [ ] `pnpm typecheck` passes with no errors across all packages
- [ ] Phase 11 spec acceptance criteria all satisfied

---

## Notes

_Use this section to record decisions, blockers, or deviations during implementation._
