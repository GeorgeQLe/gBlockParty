# gBlockParty

Personal deployment platform — deploy web apps from GitHub to your own VPS.

## Architecture

- **Monorepo**: pnpm workspaces + Turborepo
- **`packages/shared`**: Types, Drizzle DB schema, Zod validation, constants
- **`packages/core`**: Deployment engine (Docker provider, build pipeline, GitHub integration, Caddy routing)
- **`packages/cli`**: CLI tool (`gblockparty` command)
- **`apps/dashboard`**: Next.js 15 App Router — control plane UI + API routes

## Key Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages (shared → core → dashboard)
pnpm dev:dashboard    # Start dashboard dev server on :3000
pnpm typecheck        # Type-check all packages
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run database migrations
```

## Conventions

- TypeScript strict mode everywhere
- Zod for all validation (API inputs, config files)
- Drizzle ORM for database access
- Pino for logging (backend only)
- API routes use `withAuth` wrapper from `lib/api-helpers.ts`
- Environment variables validated at startup
- Secrets encrypted with AES-256 before storage

## File Organization

- Types in `packages/shared/src/types/`
- DB schema in `packages/shared/src/db/schema.ts`
- Validation schemas in `packages/shared/src/validation/`
- Backend-only code in `packages/shared/src/backend/` (not imported by frontend)
- Provider interface in `packages/core/src/providers/types.ts`
