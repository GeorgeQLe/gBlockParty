# gBlockParty (v1) — Archived

> **Status: Paused / Archived**

Personal deployment platform — deploy web apps from GitHub to your own VPS using Docker, Caddy, and PostgreSQL.

## Why archived

Development was paused after realizing the shared AWS infrastructure approach (VPS, RDS, container orchestration) cost more to build and maintain than using managed services like Vercel and Neon, which offer free tiers that cover most project needs with zero ops overhead.

For the original v0 tutorial platform, see [gBlockParty-v0](https://github.com/GeorgeQLe/gBlockParty-v0).

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   GitHub     │────▶│  Dashboard   │────▶│  Docker       │
│   Webhooks   │     │  (Next.js)   │     │  Containers   │
└─────────────┘     └──────┬───────┘     └───────┬───────┘
                           │                     │
                    ┌──────▼───────┐     ┌───────▼───────┐
                    │  PostgreSQL  │     │    Caddy       │
                    │  (RDS)       │     │  (Reverse Proxy)│
                    └──────────────┘     └───────────────┘
```

## Packages

| Package | Description |
|---------|-------------|
| `apps/dashboard` | Next.js 15 control plane (UI + API) |
| `packages/shared` | Types, DB schema, validation |
| `packages/core` | Deployment engine |
| `packages/cli` | CLI tool |
