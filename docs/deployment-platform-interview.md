# gBlockParty - Interview Log

**Interviewer:** Claude | **Interviewee:** George Le | **Date:** February 14, 2026

---

## Turn 1: Goals, Audience, MVP Scope

### Questions Asked

1. **Primary goal** — Commercial SaaS vs internal tool vs open-source?
2. **Target user** — Solo devs, small teams, or mid-size orgs?
3. **MVP scope** — Phase 1 only, Phase 1 + previews, or through Phase 3?

### Decisions

- **Goal**: Internal tool (not commercial SaaS)
- **Target user**: Solo developer
- **MVP scope**: Phase 1 + previews

### Impact

This eliminated: multi-tenancy, billing/metering, pricing tiers, team RBAC, public signup flow. Major scope reduction.

---

## Turn 2: Infrastructure, Frameworks, Scale

### Questions Asked

1. **Infrastructure stack** — AWS-native vs Cloudflare + minimal AWS vs Cloudflare-only?
2. **Frameworks** — Next.js only, Next.js + Vite/static, or all frameworks?
3. **Scale** — < 10 projects, 10-50, or 50+?

### Decisions

- **Infrastructure**: Cloudflare + minimal AWS
- **Frameworks**: Next.js only
- **Scale**: < 10 projects, few deploys/day

### Impact

Simplified build system (single framework), eliminated complex queueing needs. Cloudflare choice dramatically reduced CDN/DNS complexity.

---

## Turn 3: Next.js Mode, Build Runner

### Questions Asked

1. **Next.js deployment mode** — Static export only, full server mode, or both?
2. **Build runner** — Single VPS, Fly Machines, or GitHub Actions?

### Decisions

- **Next.js mode**: Both (static + server), configurable per project
- **Build runner**: Single VPS (recommended)

### Impact

Supporting server mode added complexity (need a Node.js runtime for SSR), but provides full Next.js capabilities.

---

## Turn 4: SSR Runtime, Control Plane

### Questions Asked

1. **SSR runtime** — Docker on VPS, Fly Machines, or OpenNext on CF Workers?
2. **Control plane** — VPS or Cloudflare Workers + D1?

### Decisions

- **SSR runtime**: Docker on VPS (recommended)
- **Control plane**: VPS (recommended)

### Impact

Consolidated everything on a single VPS — simplest possible architecture. One machine to manage.

---

## Turn 5: Static Serving, Interface

### Questions Asked

1. **Static serving** — VPS + Cloudflare cache or R2 for static/VPS for SSR?
2. **Interface** — Minimal dashboard, CLI + GitHub only, or GitHub-native only?

### Decisions

- **Static serving**: VPS + Cloudflare cache (recommended) — uniform architecture
- **Interface**: Minimal dashboard (project list, deployments, build logs, settings)

### Impact

No split serving paths. Dashboard scope is limited but functional.

---

## Turn 6: Reverse Proxy, Dashboard Stack, Custom Domains

### Questions Asked

1. **Reverse proxy** — Caddy or Traefik?
2. **Dashboard tech stack** — Next.js, React SPA, or server-rendered?
3. **Custom domains in MVP?**

### Decisions

- **Reverse proxy**: Caddy (recommended) — simple config, admin API
- **Dashboard**: Next.js (dogfooded on the platform)
- **Custom domains**: Deferred to later phase

### Impact

Caddy chosen for simplicity. Next.js dashboard serves as the first project deployed on the platform. Custom domains removal saved significant MVP complexity.

---

## Turn 7: GitHub Setup, Build Artifacts

### Questions Asked

1. **GitHub integration** — Full GitHub App or per-repo webhooks + deploy keys?
2. **Build artifacts** — Local Docker images (no registry), local registry, or tar archives?

### Decisions

- **GitHub**: Full GitHub App (user chose this despite recommendation for simpler approach)
- **Build artifacts**: Local Docker images, no registry (recommended)

### Deviation from Recommendation

User chose the more complex GitHub App approach over the simpler per-repo webhook recommendation. Rationale: wants the polished integration experience (bot identity, installation flow, scoped permissions).

---

## Turn 8: Preview Lifecycle, Auth, Env Vars

### Questions Asked

1. **Preview container lifecycle** — Always-running or stop after inactivity?
2. **Dashboard auth** — GitHub OAuth, shared secret, or Cloudflare Access?
3. **Env var complexity** — Files on VPS, separate per environment, or full spec approach?

### Decisions

- **Preview lifecycle**: Always-running (recommended) — simplicity over cost savings
- **Auth**: GitHub OAuth (recommended)
- **Env vars**: Files on VPS (recommended) — simple, sufficient for internal use

---

## Turn 9: VPS Provider, Rollback, Domain — AND Bismarck Discovery

### Questions Asked

1. **VPS provider** — Hetzner, DigitalOcean, AWS EC2, or provider-agnostic?
2. **Rollback depth** — Keep last 5, 10, or all images?
3. **Platform domain** — Existing, new, or placeholder?

### Decisions

- **Rollback**: Keep last 10 images (recommended)
- **Domain**: Use existing domain (placeholder in spec)
- **VPS provider**: User asked clarifying question about cost-sharing → led to Bismarck discussion

### Critical Discovery

User mentioned the Bismarck app — their existing AWS-hosted AI coding agent platform ($254/mo). This triggered a major architecture reconsideration.

---

## Turn 10: Architecture Revision — AWS Consolidation

### Context

After discovering Bismarck (ECS Fargate, DynamoDB, CloudFront, Terraform on AWS), the architecture discussion shifted.

### Questions Asked

1. **AWS vs VPS** — Lean into existing AWS or keep VPS separate?
2. **Railway capabilities** — What beyond Next.js deployment is needed?
3. **Migration scope** — What apps are leaving Vercel?

### Decisions

- **Architecture**: Shared ECS cluster (with ALB, Cloudflare CDN)
- **Railway scope**: Docker services + managed databases
- **Migration**: Next.js frontends + separate backend services

### Major Deviation from Original Spec

Architecture shifted from "simple VPS" to "shared AWS ECS cluster" based on existing infrastructure discovery. The platform scope expanded to include backend services and database management.

---

## Turn 11: ECS Details — Preview Costs, Build Runner

### Questions Asked

1. **Preview costs on ECS** — Per-preview ECS service vs shared runner vs VPS hybrid?
2. **Build runner on ECS** — Ephemeral Fargate tasks or dedicated server?

### Decisions

- **Previews**: Shared preview runner (recommended)
- **Build runner**: Ephemeral Fargate tasks (same pattern as Bismarck runners)

---

## Turn 12: Resource Management, Control Plane, Terraform

### Questions Asked

1. **Resource management** — AWS SDK direct or Terraform for everything?
2. **Control plane location** — ECS service or separate?
3. **Terraform relationship** — Shared with Bismarck or separate?

### Decisions

- **Resource management**: Provider abstraction with AWS SDK (user added multi-cloud consideration)
- **Control plane**: Single ECS service (recommended)
- **Bismarck relationship**: Bismarck migrates TO the platform (not the other way around)

### Critical Decision

User revealed plans for multi-cloud (Azure, Cloudflare) deployment targets. This led to the provider abstraction design. Also, Bismarck would eventually be deployed BY the platform, not share infra with it.

---

## Turn 13: Multi-Cloud, Bismarck Migration, Provider Design

### Questions Asked

1. **Multi-cloud timing** — AWS-first or multi-cloud from day one?
2. **Bismarck migration** — MVP goal or later phase?
3. **Provider design** — SDK-based abstraction or Terraform-based?

### Decisions

- **Multi-cloud**: AWS-first, abstraction planned (recommended)
- **Bismarck migration**: Later phase, provide migration instructions
- **Provider design**: DeploymentProvider interface with AWS SDK implementation

---

## Turn 14: Config Format, Build Details, Env Var Scope

### Questions Asked

1. **App configuration** — Config file + auto-detect, dashboard-only, or both?
2. **Dockerfile generation** — Auto-generate for Next.js or always user-provided?
3. **Env var scoping** — Per environment or per project?

### Decisions

- **Config**: deploy.yaml + auto-detect (recommended)
- **Dockerfile**: Auto-generate for Next.js, user-provided for others (recommended)
- **Env var scope**: Per environment — production and preview (recommended)

---

## Turn 15: Cost Analysis — First Pass

### Cost Estimate Presented

~$160/mo for the platform on ECS (not counting Bismarck).

### User Question

"How much of my $254 Bismarck bill would be shared?" — Led to detailed cost analysis.

---

## Turn 16: Bismarck Cost Verification

### Process

Explored Bismarck's Terraform configs in detail to verify the $254/mo bill.

### Findings

- Production base: ~$176-244/mo
- Staging: ~$67-77/mo
- Combined ~$243-321/mo — **$254 checks out** (likely prod ~$185 + staging ~$69)
- Biggest cost drivers: NAT Gateway ($45), ECS Orchestrator ($41), ALB ($22), VPC Endpoints ($20)

---

## Turn 17: Consolidated Cost Analysis

### Cost Estimate Presented

Shared ECS approach: ~$377/mo total (platform + Bismarck + apps + RDS).
Current: $254 (Bismarck) + $20 (Neon) + $? (Vercel) = $274+.
Net new cost: ~$103/mo.

### Critical Discovery

User revealed **Vercel is on free tier**. This meant there were no Vercel savings to capture. The ECS approach would cost ~$103/mo MORE than current spend.

---

## Turn 18: Architecture Pivot Back to VPS

### Analysis

With Vercel at $0/mo, the ECS approach wasn't cost-justified. VPS approach revisited:
- Hetzner CX32: $7/mo (vs ~$80/mo for 8 ECS services)
- Platform control plane on VPS instead of ECS: saves $10/mo
- Preview runner on VPS: saves $18/mo

### Revised Cost

| Component | Cost |
|-----------|------|
| Bismarck AWS (unchanged) | $254 |
| Hetzner VPS | $7 |
| RDS Postgres | $13 |
| S3 + Secrets Manager | $7 |
| **Total** | **$281/mo** |

**vs. current $274/mo = $7/mo net increase** for a full deployment platform.

### User Question

"Can we reduce costs anywhere else?" + "Why is Bismarck using ECS Fargate?"

---

## Turn 19: Bismarck VPS Discussion

### Question Presented

Could Bismarck move to a VPS too? Potential savings: $254 → ~$37/mo total.

### Decision

User chose "Need to think more" — Bismarck VPS migration is a big decision deferred for later consideration.

### Final Architecture

VPS (Hetzner CX32) for the deployment platform + all non-Bismarck apps. Bismarck stays on AWS unchanged for now.

---

## Turn 20: CLI, Config, Final Details

### Questions Asked

1. **CLI commands** — Proposed 8-command set
2. **CLI language** — TypeScript, Go, or Rust?

### Decisions

- **CLI commands**: login, link, deploy, env pull, env push, logs, rollback (approved as proposed)
- **CLI language**: TypeScript/Node.js (recommended)

---

## Turn 21: RDS Access, Migration, Package Manager

### Questions Asked

1. **RDS access from VPS** — Public + SSL + security group or WireGuard VPN?
2. **Neon migration approach** — Platform tool or manual pg_dump/restore?
3. **Package manager** — npm, pnpm, or multiple?

### Decisions

- **RDS access**: Public endpoint + SSL + security group (recommended)
- **Neon migration**: Manual (recommended)
- **Package manager**: pnpm (primary)

---

## Turn 22: VPS Provider, Monorepo, Wrap-Up

### Questions Asked

1. **VPS provider** — Hetzner CX32, CX42, or other?
2. **Monorepo support** — Yes, no, or both?
3. **Ready to finalize?**

### Decisions

- **VPS**: Hetzner CX32 ($7/mo)
- **Monorepo**: Support both single-app and monorepo
- **Platform name**: gBlockParty
- **Ready to finalize**: Yes

---

## Summary of Significant Deviations from Original Spec

### 1. Scope Reduction: Internal Tool (not SaaS)

**Original:** Full commercial SaaS with multi-tenancy, billing, pricing tiers, team management.
**Final:** Internal tool for a single developer. Eliminated ~40% of the original spec (sections 9, 10, and parts of 11).
**Reasoning:** User's actual need is personal infrastructure, not a business.

### 2. Architecture: VPS + Cloudflare (not AWS-native)

**Original:** Full AWS stack (CloudFront, Lambda@Edge, ECS Fargate, DynamoDB, SQS).
**Final:** Hetzner VPS ($7/mo) + Cloudflare (free) + Docker + Caddy. AWS only for RDS, S3, Secrets Manager.
**Reasoning:** Cost-driven. ECS Fargate costs ~$10-15/service/mo; a single VPS handles all apps for $7/mo. Vercel is on free tier, so no cost savings from replacing it with expensive infrastructure.

### 3. Architecture Exploration: ECS Considered and Rejected

**Mid-interview:** After discovering existing Bismarck AWS infrastructure ($254/mo), the architecture temporarily shifted to shared ECS cluster. After cost analysis showed ~$103/mo net increase with no Vercel savings (free tier), reverted to VPS approach.
**Reasoning:** Can't justify $103/mo increase when Vercel costs $0/mo. VPS achieves the same outcome at ~$7/mo.

### 4. Database Management Added (not in original MVP)

**Original:** Database management was not in Phase 1 or 2.
**Final:** RDS Postgres with "create database" UI added to MVP scope (Phase 3 but in MVP).
**Reasoning:** User is unhappy with Neon uptime ($20/mo) and has 30-40 databases. RDS at $13/mo is cheaper and more reliable.

### 5. Backend Service Support Added

**Original:** Focused on static sites and Next.js SPAs.
**Final:** Supports arbitrary Dockerized backend services via deploy.yaml.
**Reasoning:** User is migrating Next.js + separate backend services off Vercel. Needs backend hosting capability ("closer to Railway").

### 6. GitHub App Kept (against recommendation)

**Original spec:** Full GitHub App. **Interview recommendation:** Simpler per-repo webhooks for < 10 projects.
**Final:** Full GitHub App (user's preference).
**Reasoning:** User wants the polished integration experience despite the extra implementation effort.

### 7. CLI Added to MVP

**Original:** CLI was mentioned but not in Phase 1 or 2.
**Final:** CLI with 8 commands included in MVP (Phase 2).
**Reasoning:** User considers CLI important for their workflow.

### 8. Custom Domains Deferred

**Original:** Custom domains in Phase 3.
**Final:** Deferred entirely (not in any initial phase). Platform subdomains only.
**Reasoning:** Internal tool doesn't need custom domains for MVP.

### 9. Provider Abstraction Designed In

**Original:** AWS-specific throughout.
**Final:** DeploymentProvider interface with DockerProvider (MVP) and future AWSECSProvider, AzureProvider, CloudflareProvider.
**Reasoning:** User expressed interest in deploying to Azure and Cloudflare in the future.

### 10. Bismarck Migration as Future Goal

**Not in original spec.** Platform should eventually be capable of hosting Bismarck (~$80/mo savings from shared networking). Deferred to post-MVP but noted as a design consideration.
