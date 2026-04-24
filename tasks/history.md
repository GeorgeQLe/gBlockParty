# gBlockParty — Implementation History

## 2026-04-24
- Phase 1 / Step 1.1: Vitest scaffolded as the monorepo test runner (`vitest.config.ts`, root + `@gblockparty/gblock-schema` scripts, `test` task wired into `turbo.json`). `pnpm -w test` exits 0 with no tests present.
- Phase 1 / Step 1.2: Added 14 failing Vitest cases at `packages/gblock-schema/src/__tests__/schema.test.ts` pinning the discriminated-union contract (per-type required fields, episode videoUrl/audioUrl OR, unknown type, shared optional fields, membership default). Also added a package-local `packages/gblock-schema/vitest.config.ts` so `pnpm --filter` picks up `src/**/*.test.ts` (root include pattern didn't match when CWD is the package). Tests import via relative path (`../index`) so failures trace to the current flat schema, not module resolution. `pnpm --filter @gblockparty/gblock-schema test` and `pnpm -w test` both exit non-zero (7 red / 7 green) — the intended red state for Step 1.4 to target.
