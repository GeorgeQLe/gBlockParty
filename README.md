# gBlockParty

Personal deployment platform — deploy web apps from GitHub to your own VPS.

## Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your configuration
pnpm dev:dashboard
```

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
