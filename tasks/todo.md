# gBlockParty — Phase 1 of 4: Foundation

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-24

## Priority Task Queue

- [x] Task pipeline is healthy; Phase 1 is planned and ready. Start at **Step 1.1** below.
- [x] Step 1.1 (Vitest scaffold) shipped 2026-04-24.
- [x] Step 1.2 (failing schema tests) shipped 2026-04-24.
- [x] Step 1.3 (failing MDX loader tests) shipped 2026-04-24. **Next: Step 1.4 — discriminated-union schema implementation (first green step).**

## Next step: Phase 1, Step 1.4 — Migrate schema to discriminated union (first green step)

### Context

Phase 1 has shipped Steps 1.1 (Vitest scaffold), 1.2 (14 failing schema tests — 7 red / 7 green), and 1.3 (5 failing MDX loader tests — all red on missing `../loader`/`../collections` modules). Step 1.4 is the first **green** step of Phase 1: rewrite `packages/gblock-schema/src/index.ts` from a flat enum-based `z.object({...})` into a `z.discriminatedUnion("type", […])` so the 7 red schema cases from Step 1.2 turn green without breaking the 7 already-green cases. The loader tests from Step 1.3 remain red — Step 1.6 owns them.

### Ship status going in

- **Shipped last session:** `apps/web/src/lib/content/__tests__/loader.test.ts` (5 red cases), `apps/web/src/lib/content/__tests__/fixtures/**` (valid, invalid, dupe MDX trees + good/bad collection YAMLs), `apps/web/vitest.config.ts`, `test` + `test:watch` scripts in `apps/web/package.json`, `tasks/history.md`, `tasks/todo.md`.
- **Test status:** `pnpm -w test` exits non-zero: 7 red schema cases, 7 green schema cases, 1 loader suite failing on unresolved `../loader`.
- **No git remote:** local `master` only; `git push` is a no-op.
- **Deploy:** none.

### What this step does

Rewrites `packages/gblock-schema/src/index.ts` so that:

- A shared base schema holds the common fields (`slug`, `collection`, `title`, `summary?`, `publishedAt?`, `canonicalUrl?`, `crossPosts?`, `tags?`, `membership` default `"free"`, plus the shared optional fields `heroImage?`, `videoUrl?`, `featured?`, `seriesSlug?`).
- Per-type schemas extend the base with `type: z.literal(...)` and the per-type required fields:
  - `tutorial`: optional `readingTimeMinutes?`.
  - `essay`: optional `readingTimeMinutes?`.
  - `episode`: uses `.refine()` to require at least one of `videoUrl` / `audioUrl` (adds `audioUrl?` if not already present on the base).
  - `stream`: requires `videoUrl` and `startedAt` (datetime).
  - `clip`: requires `videoUrl`; optional `parentSlug?`.
  - `repo`: requires `repoUrl` (url).
  - `tool`: requires `demoUrl` (url).
  - `demo`: requires `demoUrl` (url).
- Export `gBlockSchema = z.discriminatedUnion("type", [...])` covering all 8 types.
- `gBlockTypeSchema` is updated to the full 8-type enum (adds `clip`, `stream`).
- `collectionSchema` is unchanged (Step 1.3 fixtures already match the current schema).

### Files to create / modify

- **Modify:** `packages/gblock-schema/src/index.ts` (rewrite in place).
- **Do not modify:** test files, loader fixtures, or any code under `apps/**`.

### Approach & key decisions

- Keep `membership` default `"free"` on the base so every variant inherits it.
- Zod v3 discriminated unions require the `type` field to be a literal on each variant — cannot live on the base via `.extend()` without re-declaring. Re-declare `type: z.literal("...")` on each variant schema.
- `episode.refine((v) => v.videoUrl || v.audioUrl, { message: "episode requires videoUrl or audioUrl" })` — apply `.refine()` on the variant *before* putting it in the discriminated union (Zod supports this in v3.22+).
- Add `audioUrl: z.string().url().optional()` to the `episode` variant (not the base) to keep the surface minimal.
- `clip.parentSlug` is optional and is a plain `z.string()` (slug reference), not a URL.
- For `stream.startedAt` use `z.string().datetime()` to match `publishedAt`.

### Test cases (pre-existing, from Step 1.2)

All 14 cases in `packages/gblock-schema/src/__tests__/schema.test.ts` must pass after this step:

- ✅ valid `tutorial` passes
- ✅ valid `essay` passes
- 🔴 `episode` without both `videoUrl` AND `audioUrl` fails
- 🔴 `episode` with only `videoUrl` passes
- 🔴 `episode` with only `audioUrl` passes
- ✅ `stream` missing `videoUrl` fails (currently passes for wrong reason — will still pass, now for the right reason)
- ✅ `stream` missing `startedAt` fails
- ✅ `clip` missing `videoUrl` fails
- 🔴 `repo` missing `repoUrl` fails
- 🔴 `tool` missing `demoUrl` fails
- 🔴 `demo` missing `demoUrl` fails
- ✅ unknown `type` fails
- 🔴 shared optional fields (`heroImage`, `featured`, `seriesSlug`, `videoUrl`) accepted on any type
- ✅ `membership` defaults to `"free"` when omitted

### Acceptance criteria for Step 1.4

- [ ] `pnpm --filter @gblockparty/gblock-schema test` exits 0 (all 14 green).
- [ ] `pnpm -w test` still exits non-zero **only** because the Step 1.3 loader suite is red (no regression on schema tests).
- [ ] `pnpm -w -r typecheck` passes — no downstream type breakage from the new `GBlock` union type.
- [ ] No changes under `apps/**`, `content/**`, or `tasks/**` (except the routine handoff edits below).
- [ ] `packages/gblock-schema/src/index.ts` exports `gBlockSchema`, `gBlockTypeSchema`, `GBlock`, `GBlockType`, `collectionSchema`, `Collection`.

### Ship-one-step handoff contract (Step 1.4 → 1.5)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.4**. Do not continue into 1.5.
2. Verify all 14 schema tests are green and loader tests remain red (unchanged).
3. Mark Step 1.4 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Write Step 1.5's plan (playful-brutalist design tokens in `apps/web/src/app/globals.css`) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.5 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.5.

---

## (Archived) Phase 1, Step 1.3 — Write failing MDX loader tests

### Context

Steps 1.1 (Vitest scaffold) and 1.2 (14 failing schema tests, 7 red / 7 green against the current flat schema) shipped 2026-04-24. Phase 1 continues in TDD mode. Step 1.3 adds the second intentionally-red suite — it pins the contract for the MDX content loader that Step 1.6 will implement. The schema tests from 1.2 remain red; that's expected and will be resolved by Step 1.4.

### Ship status going in

- **Shipped last session:** `packages/gblock-schema/src/__tests__/schema.test.ts` (14 cases), `packages/gblock-schema/vitest.config.ts` (package-local include so `pnpm --filter` picks up tests), `tasks/history.md`, `tasks/todo.md`.
- **Test status:** `pnpm -w test` exits non-zero (7 red schema cases, 7 green). Step 1.3 will add more red cases; that's fine.
- **No git remote:** local `master` only; `git push` is a no-op.
- **Deploy:** none.

### What this step does

Writes failing Vitest cases for two functions that Step 1.6 will implement:

- `loadAllGBlocks()` — walks `content/gblocks/<collection>/<slug>.mdx`, parses frontmatter via `gray-matter`, validates with `gBlockSchema`, surfaces file path in validation errors, and throws on duplicate slugs across collections.
- `loadCollection(slug)` — reads + `js-yaml` parses + `collectionSchema.parse()` on `content/collections/<slug>.yaml`.

Tests must be red at step completion. Do not create `apps/web/src/lib/content/*.ts` or install MDX deps in this step (Step 1.6 owns that). Do create test fixtures — small MDX and YAML files under `apps/web/src/lib/content/__tests__/fixtures/` — since they're the inputs the tests load.

### Files to create / modify

- **Create:** `apps/web/src/lib/content/__tests__/loader.test.ts`
- **Create:** fixtures under `apps/web/src/lib/content/__tests__/fixtures/` — at minimum one valid MDX per collection the test exercises, one intentionally-invalid MDX (e.g., `episode` with no `videoUrl`/`audioUrl`) to assert error messages include the file path, two MDX files sharing a slug across collections to assert the duplicate-slug throw, and one valid + one invalid collection YAML.
- **Create:** `apps/web/vitest.config.ts` (package-local include mirroring the schema package pattern) if `pnpm --filter @gblockparty/web test` doesn't already pick up `src/**/*.test.ts` from the `apps/web` directory. Verify first before creating.
- **Create:** `"test": "vitest run"` and `"test:watch": "vitest"` scripts in `apps/web/package.json` if missing. Verify first.
- **Do not modify:** `apps/web/src/lib/content/**` implementation files, `apps/web/package.json` dependencies (Step 1.6 adds `gray-matter`, `js-yaml`).

### Test cases (spec §5)

- `loadAllGBlocks()` returns all fixture gBlocks with parsed frontmatter and body content included.
- `loadAllGBlocks()` rejects an invalid fixture (e.g., `episode` with no video or audio) with an error whose message contains the offending file path.
- `loadAllGBlocks()` throws on duplicate slug across two different collections.
- `loadCollection("gcanbuild")` reads + validates the fixture `gcanbuild.yaml` and returns a matching object.
- `loadCollection()` throws when the YAML fails `collectionSchema.parse()`.

### Approach & key decisions

- Import loader functions from `@gblockparty/web` path(s) that Step 1.6 will create (e.g., `../loader`, `../collections`, or an `index.ts` barrel). If the modules don't yet exist, the import failure is the red signal — do not stub them.
- Point the loader at a test-local content root via an env var or function arg so fixtures live under `__tests__/fixtures/` instead of the real `content/` tree. Decide the contract now and document it in the test file's comments so Step 1.6 has a clear target (preferred: `loadAllGBlocks({ contentRoot })` / `loadCollection(slug, { collectionsRoot })` — simple DI, no env-var coupling).
- Keep fixtures minimal — two or three gBlocks is enough to exercise discovery, frontmatter parsing, error paths, and duplicate-slug collision.
- One assertion per `it()` block so Step 1.6 failures diagnose cleanly.
- `expect(() => fn()).toThrow(/path-fragment/)` where possible, so file-path-in-error is actually pinned.

### Acceptance criteria for Step 1.3

- [ ] `apps/web/src/lib/content/__tests__/loader.test.ts` exists with the 5 cases above.
- [ ] Fixture files under `apps/web/src/lib/content/__tests__/fixtures/` exist and cover valid/invalid MDX + valid/invalid YAML + duplicate-slug pair.
- [ ] `pnpm --filter @gblockparty/web test` exits non-zero (red is the desired state).
- [ ] `pnpm -w test` exits non-zero (Step 1.2 + Step 1.3 red cases).
- [ ] No changes to `apps/web/src/lib/content/*.ts` implementation; no new production deps.
- [ ] Schema tests from Step 1.2 still present and still red in the same way (not accidentally deleted).

### Ship-one-step handoff contract (Step 1.3 → 1.4)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.3**. Do not continue into 1.4.
2. Verify tests are red and failures trace to missing loader modules or missing fixtures, not to syntax errors in the test file.
3. Mark Step 1.3 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Write Step 1.4's plan (discriminated-union schema implementation) into `tasks/todo.md` as a self-contained block. Note: Step 1.4 is the first green step — it should turn the Step 1.2 schema tests green without touching loader tests.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.4 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.4.


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
- [x] Step 1.2: Write failing schema validation tests
  - Files: created `packages/gblock-schema/src/__tests__/schema.test.ts` + package-local `packages/gblock-schema/vitest.config.ts` so `pnpm --filter` picks up `src/**/*.test.ts`.
  - Cases: valid `tutorial` / `essay` pass; `episode` without both `videoUrl` AND `audioUrl` fails; `episode` with only `videoUrl` passes; `episode` with only `audioUrl` passes; `stream` missing `videoUrl` fails; `stream` missing `startedAt` fails; `clip` missing `videoUrl` fails; `repo` missing `repoUrl` fails; `tool`/`demo` missing `demoUrl` fails; unknown `type` fails; shared optional fields (`heroImage`, `featured`, `seriesSlug`, `videoUrl`) accepted on any type; `membership` defaults to `"free"` when omitted.
  - Result: 14 tests, 7 red / 7 green — exit non-zero as intended. Red failures all trace to the current flat schema (missing per-type required fields, stripped optional fields) — exactly the contract Step 1.4 will make green.
- [x] Step 1.3: Write failing MDX pipeline tests
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
