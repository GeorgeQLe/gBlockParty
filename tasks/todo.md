# gBlockParty - Development TODO

Project: Personal deployment platform (GitHub to VPS)
Repo state: Initial scaffolding complete (monorepo with shared types, core engine, dashboard, CLI, and infra stubs)

---

## Phase 1: Infrastructure Provisioning
- [ ] Step 1: Terraform AWS resources (RDS, S3, Secrets Manager, security groups, IAM)
- [ ] Step 2: VPS provisioning (Hetzner CX32 setup, SSH hardening, UFW)
- [ ] Step 3: Docker & Caddy setup on VPS
- [ ] Step 4: Cloudflare DNS configuration (wildcard *.yourdomain.dev)
- [ ] Step 5: Infrastructure verification (connectivity, security audit, cost check)

## Phase 2: Database & Migrations
- [ ] Step 1: Generate Drizzle migrations from existing schema (7 tables)
- [ ] Step 2: Run migrations & verify schema (CRUD tests per table)
- [ ] Step 3: Database connection pool configuration (SSL, pool sizing)

## Phase 3: Authentication & GitHub App
- [ ] Step 1: GitHub App registration & configuration
- [ ] Step 2: OAuth callback handler
- [ ] Step 3: Auth API routes (`/api/auth/me`, `/api/auth/logout`, session management)
- [ ] Step 4: GitHub App client implementation (installation tokens, commit status, PR comments)
- [ ] Step 5: Webhook event router (signature validation, push/PR event routing)

## Phase 4: Build System
- [ ] Step 1: Framework detection (`detectFramework()` -- Next.js, Dockerfile, static)
- [ ] Step 2: Docker client operations (`buildImage`, `runContainer`, `stopContainer`, `getContainerLogs`, `pruneImages`)
- [ ] Step 3: DockerProvider implementation (full `DeploymentProvider` interface)
- [ ] Step 4: Build pipeline (`BuildRunner.run()` -- clone, detect, cache, install, build, image, tag)
- [ ] Step 5: Build logging & S3 storage (real-time capture, secret scrubbing, streaming)

## Phase 5: Deployment Engine
- [ ] Step 1: Port allocator (find free ports, persist allocations, handle exhaustion)
- [ ] Step 2: Caddy dynamic routing client (add/remove reverse proxy routes)
- [ ] Step 3: Health check system (polling, retry, timeout)
- [ ] Step 4: Environment variable injection (secrets decryption, temp .env cleanup)
- [ ] Step 5: Deployer orchestration (full deploy pipeline, failure rollback, DB status updates)

## Phase 6: Core Dashboard & API
- [ ] Step 1: Projects API (CRUD, GitHub repo linking)
- [ ] Step 2: Deployments API (trigger, list, status)
- [ ] Step 3: Environment variables API (create, update, delete, encrypt secrets)

## Phase 7: Preview Deployments
- [ ] Step 1: PR webhook handler (open/sync/close events)
- [ ] Step 2: Preview deployment pipeline (ephemeral containers, subdomain routing)
- [ ] Step 3: Commit status & PR comments (build status, preview URL)

## Phase 8: Caching, Streaming & Rollback
- [ ] Step 1: Dependency cache (S3-backed node_modules / .pnpm-store caching)
- [ ] Step 2: Framework cache (Next.js .next/cache, build output caching)
- [ ] Step 3: Log streaming (real-time build log streaming to dashboard)
- [ ] Step 4: Log retrieval (fetch historical logs from S3)

## Phase 9: CLI Tool
- [ ] Step 1: CLI API routes (token auth endpoints for CLI)
- [ ] Step 2: Login command (`gblockparty login`)
- [ ] Step 3: Link command (`gblockparty link`)
- [ ] Step 4: Deploy command (`gblockparty deploy`)
- [ ] Step 5: Env commands (`gblockparty env pull/push`)

## Phase 10: Database Management
- [ ] Step 1: Database provisioner (create/delete managed PostgreSQL instances)
- [ ] Step 2: Database API routes (CRUD for managed databases)
- [ ] Step 3: Database dashboard UI (create, view, manage databases)
- [ ] Step 4: Connection string & credentials management

## Phase 11: Monorepo & Advanced Config
- [ ] Step 1: Config parser (`deploy.yaml` / `gblockparty.json` support)
- [ ] Step 2: Monorepo detection (workspace detection, root dir configuration)
- [ ] Step 3: Multi-service orchestration (deploy multiple services from one repo)
- [ ] Step 4: Backend service deployment (non-web services, worker processes)

## Phase 12: Notifications, Monitoring & Polish
- [ ] Step 1: Slack integration
- [ ] Step 2: Discord integration
- [ ] Step 3: Notification settings UI
- [ ] Step 4: Notification triggers (deploy success/failure, health check alerts)
- [ ] Step 5: Platform settings page
- [ ] Step 6: VPS monitoring (disk, memory, CPU dashboards)

---

## Notes

- All phases are currently **Not Started**. Only the initial monorepo scaffolding is in place.
- Several core modules have stub implementations (throw "Not implemented") ready to be filled in.
- Phases have dependencies: 1 -> 2 -> 3 -> 4 -> 5 -> 6 (critical path). Phases 7-12 branch after phase 5/6.
- Key already-implemented pieces: Dockerfile generator, build queue, S3 client, DB schema, shared types/constants.
