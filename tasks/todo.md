# gBlockParty — Phase 1 of 4: Foundation

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-24

## Priority Task Queue

- [x] Task pipeline is healthy; Phase 1 is planned and ready. Start at **Step 1.1** below.
- [x] Step 1.1 (Vitest scaffold) shipped 2026-04-24. **Next: Step 1.2 — failing schema validation tests.**

## Next step: Phase 1, Step 1.2 — Write failing schema validation tests

### Context

Step 1.1 landed Vitest as the monorepo test runner (`vitest.config.ts` + root/package scripts + turbo `test` task). `pnpm -w test` exits 0 against zero tests. Phase 1 is TDD; Step 1.2 is the first intentionally-red step — it pins the contract for the discriminated-union schema that Step 1.4 will implement.

### Ship status going in

- **Shipped last session (committed locally, no remote):** `vitest.config.ts`, root `package.json` scripts, `packages/gblock-schema/package.json` scripts, `turbo.json` test task, `tasks/history.md`, `pnpm-lock.yaml`, `.claude/settings.local.json` (added `showClearContextOnPlanAccept`, `permissions.defaultMode`).
- **Test status:** zero tests; `pnpm -w test` exits 0.
- **No git remote:** local `master` only; `git push` is a no-op.
- **Deploy:** none — no deploy contract.

### What this step does

Writes failing Vitest cases that pin the shape of the forthcoming `z.discriminatedUnion("type", …)` schema. The tests MUST be red when the step completes — they define the target Step 1.4 has to hit. Do not edit `packages/gblock-schema/src/index.ts` in this step.

### Files to create / modify

- **Create:** `packages/gblock-schema/src/__tests__/schema.test.ts`
- **Do not modify:** `packages/gblock-schema/src/index.ts` (Step 1.4's owner changes this)

### Test cases (spec §3)

- Valid `tutorial` frontmatter parses.
- Valid `essay` frontmatter parses.
- `episode` with neither `videoUrl` nor `audioUrl` fails.
- `episode` with only `videoUrl` passes.
- `episode` with only `audioUrl` passes.
- `stream` missing `videoUrl` fails.
- `stream` missing `startedAt` fails.
- `clip` missing `videoUrl` fails.
- `repo` missing `repoUrl` fails.
- `tool` missing `demoUrl` fails.
- `demo` missing `demoUrl` fails.
- Unknown `type` fails.
- Shared optional fields (`heroImage`, `featured`, `seriesSlug`, `videoUrl`) accepted on any type.
- `membership` defaults to `"free"` when omitted.

### Approach & key decisions

- Import the exported `gBlockSchema` from `@gblockparty/gblock-schema`. If it doesn't yet exist under that name, the import failure itself is the red signal — do not stub it.
- Use `expect(() => gBlockSchema.parse(input)).toThrow()` for failure cases and `expect(gBlockSchema.parse(input)).toMatchObject({...})` for success cases.
- Keep fixtures inline (small factory helpers per type) — no MDX files yet; those are Step 1.3.
- Test one assertion per `it()` block so failures in Step 1.4 diagnose cleanly.

### Acceptance criteria for Step 1.2

- [ ] `packages/gblock-schema/src/__tests__/schema.test.ts` exists with the 14 cases above.
- [ ] `pnpm --filter @gblockparty/gblock-schema test` exits non-zero (red is the expected, desired state).
- [ ] No changes to `src/index.ts`.

### Ship-one-step handoff contract (Step 1.2 → 1.3)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.2**. Do not continue into 1.3.
2. Verify tests are red (failures trace to missing/flat schema, not to syntax errors in the test file).
3. Mark Step 1.2 done in `tasks/todo.md`.
4. Append a one-line record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Write Step 1.3's plan (failing MDX loader tests) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant (keys present from Step 1.1); do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.3 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.3.


## Pre-phase setup (do once)

- [ ] `pnpm install` at repo root (if not already done).
- [ ] Confirm `pnpm -w -r typecheck` passes against the current scaffold before starting Phase 1.

## Phase 1: Foundation

**Goal**: Establish the content and design primitives every later phase depends on — the validated schema, the playful-brutalist token set, and a working MDX loader — so that gBlock authoring and page rendering can proceed independently.

**Scope**:
- Convert `packages/gblock-schema` from flat enum to `z.discriminatedUnion("type", …)` with type-specific required fields.
- Add types `clip` and `stream`; add shared fields `heroImage`, `videoUrl`, `featured`, `seriesSlug`.
- Write playful-brutalist design tokens into `apps/web/src/app/globals.css` (colors, borders/shadows, radii, typography, motion).
- Build MDX pipeline at `apps/web/src/lib/content/*` (file discovery, frontmatter parse, Zod validation, collection-YAML validation).
- Seed `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml`.
- Expose MDX component stubs: `<YouTube>`, `<RepoCard>`, `<Callout>`, `<AudioPlayer>`.

> Test strategy: tdd

### Execution Profile
**Parallel mode:** implementation-safe
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:**
- Lane: schema
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Convert flat enum to discriminated union with `clip`/`stream` types and per-type required fields.
  - Owns: `packages/gblock-schema/**`
  - Must not edit: `apps/**`, `content/**`, `tasks/**`
  - Depends on: Step 1.1 (test scaffolding)
  - Deliverable: updated `packages/gblock-schema/src/index.ts`, passing per-type validation tests
- Lane: design-tokens
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Write playful-brutalist tokens per spec §4; wire Tailwind v4 consumption.
  - Owns: `apps/web/src/app/globals.css`, `apps/web/postcss.config.js`
  - Must not edit: `packages/**`, `content/**`, `apps/web/src/lib/**`, `tasks/**`
  - Depends on: none
  - Deliverable: updated `globals.css`; `pnpm --filter @gblockparty/web build` succeeds
- Lane: mdx-pipeline
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Install MDX deps; build content loader (discovery, frontmatter, validation, collection YAMLs); MDX component stubs.
  - Owns: `apps/web/src/lib/content/**`, `apps/web/src/components/mdx/**`, `content/collections/**`, `apps/web/package.json` (deps only)
  - Must not edit: `packages/**`, `apps/web/src/app/**`, `tasks/**`, `apps/web/src/app/globals.css`
  - Depends on: schema lane (exported types)
  - Deliverable: `loadAllGBlocks()` + `loadCollection()` functions, 3 collection YAMLs, MDX stubs, passing loader tests

### Tests First
- [x] Step 1.1: Set up Vitest as the monorepo test runner
  - Files: create `vitest.config.ts` at repo root; add `vitest` + `@vitest/ui` to root `devDependencies`; add `"test": "vitest run"` and `"test:watch": "vitest"` scripts at root and in `packages/gblock-schema/package.json`.
- [ ] Step 1.2: Write failing schema validation tests
  - Files: create `packages/gblock-schema/src/__tests__/schema.test.ts`
  - Cases: valid `tutorial` / `essay` pass; `episode` without both `videoUrl` AND `audioUrl` fails; `episode` with only `videoUrl` passes; `episode` with only `audioUrl` passes; `stream` missing `videoUrl` fails; `stream` missing `startedAt` fails; `clip` missing `videoUrl` fails; `repo` missing `repoUrl` fails; `tool`/`demo` missing `demoUrl` fails; unknown `type` fails; shared optional fields (`heroImage`, `featured`, `seriesSlug`, `videoUrl`) accepted on any type; `membership` defaults to `"free"` when omitted.
  - Expected: red.
- [ ] Step 1.3: Write failing MDX pipeline tests
  - Files: create `apps/web/src/lib/content/__tests__/loader.test.ts` and fixtures under `apps/web/src/lib/content/__tests__/fixtures/`
  - Cases: `loadAllGBlocks()` discovers fixtures, parses frontmatter + body, rejects invalid frontmatter with file path in error; `loadCollection("gcanbuild")` reads + validates `content/collections/gcanbuild.yaml`; duplicate-slug collision throws.
  - Expected: red.

### Implementation
- [ ] Step 1.4: Migrate schema to discriminated union _(Lane: schema)_
  - Files: modify `packages/gblock-schema/src/index.ts`
  - Build per-type schemas by extending a shared-field base. `episode` uses `.refine()` to require at least one of `videoUrl`/`audioUrl`. `stream` requires `videoUrl` + `startedAt`. `clip` requires `videoUrl` + optional `parentSlug?`. `repo` requires `repoUrl`. `tool`/`demo` require `demoUrl`. `tutorial`/`essay` add optional `readingTimeMinutes?`. Export `gBlockSchema = z.discriminatedUnion("type", […])`.
- [ ] Step 1.5: Write playful-brutalist design tokens _(Lane: design-tokens)_
  - Files: modify `apps/web/src/app/globals.css`
  - Define color, radius, border/shadow, typography tokens per spec §4 as CSS custom properties in a Tailwind v4 `@theme { … }` block so utilities like `bg-bg`, `text-ink`, `shadow-brutal` are generated. Load Inter Variable + JetBrains Mono Variable (prefer `next/font` in the layout if cleaner than `@font-face`). Set body defaults.
- [ ] Step 1.6: Install MDX tooling + build content loader _(Lane: mdx-pipeline)_
  - Files: modify `apps/web/package.json` (add `gray-matter`, `next-mdx-remote`, `js-yaml`, `@types/js-yaml`); create `apps/web/src/lib/content/paths.ts`, `loader.ts`, `collections.ts`, `index.ts`; create `apps/web/src/components/mdx/{YouTube,RepoCard,Callout,AudioPlayer}.tsx`
  - `loader.loadAllGBlocks()` walks `content/gblocks/<collection>/<slug>.mdx`, `gray-matter` parse, `gBlockSchema.parse()` with error wrapping, global slug-uniqueness check. `collections.loadCollection(slug)` reads + `js-yaml` parses + `collectionSchema.parse()`.
- [ ] Step 1.7: Seed collection YAMLs _(Lane: mdx-pipeline)_
  - Files: create `content/collections/gcanbuild.yaml`, `weekly-sota.yaml`, `weekly-g.yaml` per spec §2.

### Green
- [ ] Step 1.8: `pnpm -w test` — all Phase 1 tests green.
- [ ] Step 1.9: `pnpm -w -r typecheck && pnpm --filter @gblockparty/web build` — clean.
- [ ] Step 1.10: Refactor while keeping tests green (consolidate shared Zod fields, clean MDX barrel exports).

### Milestone: Phase 1 Foundation Ready
- [ ] `packages/gblock-schema` exports a Zod discriminated union with all 8 types; `pnpm typecheck` passes across the monorepo.
- [ ] Per-type required fields enforced: `episode` requires `videoUrl` or `audioUrl`; `stream` requires `videoUrl` + `startedAt`; `clip` requires `videoUrl`; `repo` requires `repoUrl`; `tool`/`demo` require `demoUrl`.
- [ ] `apps/web/src/app/globals.css` defines the full token set (colors, borders, shadows, radii, typography) as CSS custom properties accessible via Tailwind v4 utilities.
- [ ] A unit test successfully parses and validates a sample MDX frontmatter for each of the 3 active collections.
- [ ] Invalid frontmatter (e.g., `episode` without video or audio) fails validation with a clear error.
- [ ] `content/collections/gcanbuild.yaml`, `weekly-sota.yaml`, `weekly-g.yaml` exist and validate against `collectionSchema`.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests. _(None yet — this is the first phase with tests.)_

## Follow-ups (deferred; revisit in later phases)

- [ ] Decommission `lexcorp-war-room/portfolio/boston-founder-radio.yaml` — scheduled for Phase 4.
- [ ] Add `lexcorp-war-room/portfolio/gblockparty.yaml` with platform-level KPIs — scheduled for Phase 4.
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).
- [ ] Create GitHub repo `GeorgeQLe/gblockparty` — scheduled for Phase 3 (Launch).
- [ ] Create Vercel project, link `gblockparty.com` — scheduled for Phase 3 (Launch).
