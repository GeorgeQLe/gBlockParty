# gBlockParty — Phase 1 of 4: Foundation

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-24

## Priority Task Queue

- [x] Task pipeline is healthy; Phase 1 is planned and ready. Start at **Step 1.1** below.
- [x] Step 1.1 (Vitest scaffold) shipped 2026-04-24.
- [x] Step 1.2 (failing schema tests) shipped 2026-04-24.
- [x] Step 1.3 (failing MDX loader tests) shipped 2026-04-24.
- [x] Step 1.4 (discriminated-union schema) shipped 2026-04-24.
- [x] Step 1.5 (playful-brutalist design tokens) shipped 2026-04-24.
- [x] Step 1.6 (MDX tooling + content loader) shipped 2026-04-24.
- [x] Step 1.7 (seed collection YAMLs) shipped 2026-04-24.
- [x] Step 1.8 (green-bar verification) shipped 2026-04-24.
- [x] Step 1.9 (workspace typecheck + build formal gate) shipped 2026-04-24. **Next: Step 1.10 — refactor while keeping tests green.**

## Next step: Phase 1, Step 1.10 — Refactor while keeping tests green

### Context

Steps 1.1–1.9 are complete. All 19 tests green, typecheck clean across both packages, build produces 4 static pages. Step 1.10 is the final "Green" step of Phase 1 — a refactor pass that cleans up implementation debt accumulated during 1.4–1.7 while keeping the entire test + typecheck + build suite green throughout.

### Ship status going in

- **Shipped last session:** Step 1.9 formal gate passed — cold typecheck (2 packages) + cold build (4 static pages) both green. No production changes.
- **Test status:** `pnpm -w test` 19/19 cold. `pnpm -w -r typecheck` clean cold. `pnpm --filter @gblockparty/web build` green cold (4 static pages).
- **No git remote:** local `master` only; `git push` is a local no-op.
- **Deploy:** none.

### What this step does

1. **Consolidate shared Zod fields** in `packages/gblock-schema/src/index.ts` if any duplication exists across variant schemas (e.g. shared optional fields repeated on each variant instead of being inherited cleanly).
2. **Clean MDX barrel exports** at `apps/web/src/lib/content/index.ts` — ensure all public symbols are re-exported, remove any dead/redundant exports.
3. **Any minor cleanup** that surfaced during 1.4–1.9 implementation: unused imports, inconsistent naming, stale comments.
4. **Verify** tests, typecheck, and build remain green after every change.

### Files to create / modify

- **May modify:** `packages/gblock-schema/src/index.ts` (Zod field consolidation), `apps/web/src/lib/content/index.ts` (barrel cleanup), `apps/web/src/lib/content/{loader,collections,paths}.ts` (minor cleanup).
- **Must not modify:** test files or fixtures (tests are the contract — refactor must not change them), `content/collections/**` (locked since 1.7), `apps/web/src/app/globals.css` (locked since 1.5).
- **Routine handoff edits** to `tasks/{todo,history}.md` allowed.

### Approach & key decisions

- **Refactor only — no new features.** Every change must be behavior-preserving as proven by the existing 19-test suite.
- **Incremental verification.** Run `pnpm -w test` after each meaningful change to ensure no regression.
- **No new deps.** No new test cases (unless a refactor reveals an untested edge, in which case add the test first).

### Acceptance criteria for Step 1.10

- [ ] `pnpm -w test` exits 0 (19/19 — no tests added or removed).
- [ ] `pnpm -w -r typecheck` exits 0.
- [ ] `pnpm --filter @gblockparty/web build` exits 0 (4 static pages).
- [ ] Shared Zod fields consolidated (no duplication across variant schemas).
- [ ] MDX barrel exports clean — all public symbols re-exported.
- [ ] Step 1.10 checked off in `tasks/todo.md`.
- [ ] `tasks/history.md` has a Step 1.10 entry.

### Ship-one-step handoff contract (Step 1.10 → Phase 1 Milestone)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.10**. Do not continue into Phase 2.
2. Verify tests + typecheck + build green after each refactor.
3. Mark Step 1.10 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Check off the Phase 1 Milestone items in `tasks/todo.md`.
6. Commit and push (push is a local no-op — flag the missing remote).
7. Deploy: none.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Stop before implementing Phase 2.

---

## (Archived) Phase 1, Step 1.8 — Green-bar verification

### Context

Step 1.7 just shipped: `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml` exist and parse through `collectionSchema`. Phase 1's Tests-First queue (1.1–1.3) and Implementation queue (1.4–1.7) are both complete. Step 1.8 is the first of three "Green" steps (1.8 / 1.9 / 1.10) — a lightweight verification pass that confirms `pnpm -w test` is still green across the workspace and tidies anything that fell out of the prior implementation steps.

### Ship status going in

- **Shipped last session:** three collection YAMLs under `content/collections/` per spec §2 verbatim; pre-existing `boston-founder-radio.yaml` left alone (Phase 4 decommission is a separate tracked follow-up).
- **Test status:** `pnpm -w test` → 19/19 green. `pnpm -w -r typecheck` clean. `pnpm --filter @gblockparty/web build` → 4 static pages, green.
- **No git remote:** local `master` only; `git push` is a local no-op.
- **Deploy:** none.

### What this step does

Verifies the green bar and does minor tidy-up only. Specifically:

1. Re-run `pnpm -w test`, `pnpm -w -r typecheck`, and `pnpm --filter @gblockparty/web build` cold (no turbo cache) to confirm the workspace is green end-to-end, not just incrementally.
2. Sanity-check that `loadCollection()` can read from the real `content/collections/` tree (not just fixtures) by pointing a one-off probe at the default `COLLECTIONS_ROOT` and loading each of the three slugs. No committed probe.
3. Sanity-check that `loadAllGBlocks({ contentRoot: "content" })` short-circuits cleanly on the empty `content/gblocks/` (no files yet) — should return `[]` without error.
4. Any trivial tidy-up that surfaces: stray TODO comments, unused imports, an obvious lint warning from the loader/paths modules. Keep the diff narrow — bigger refactors belong to Step 1.10.

### Files to create / modify

- **Likely no production file changes.** If tidy-up surfaces, confine edits to `apps/web/src/lib/content/**` or `apps/web/src/components/mdx/**`.
- **Must not modify:** `packages/gblock-schema/src/index.ts` (locked since 1.4), `content/collections/**` (locked since 1.7), `apps/web/src/app/globals.css` (locked since 1.5).

### Approach & key decisions

- **Cold run** the test + typecheck + build commands to defeat the turbo cache — a clean re-run catches any mtime-sensitive regressions that incremental builds mask.
- **Probe, don't test.** If the probe reveals a real gap (e.g. default `CONTENT_ROOT` resolves relative to `process.cwd()` and breaks outside repo root), add a one-line fix; don't scaffold new tests — Step 1.10 refactor owns shared extraction.
- **No new deps.** If something needs a dep, it's not Step 1.8.

### Acceptance criteria for Step 1.8

- [ ] `pnpm -w test` exits 0 after a cold run (turbo cache cleared or force-rerun) — still 19/19.
- [ ] `pnpm -w -r typecheck` clean cold.
- [ ] `pnpm --filter @gblockparty/web build` green cold.
- [ ] `loadCollection()` against the real `content/collections/` tree returns validated objects for all three slugs (probed, not committed).
- [ ] `loadAllGBlocks({ contentRoot: "content" })` returns `[]` cleanly (probed, not committed).
- [ ] Diff confined to at most a few lines of tidy-up plus the routine `tasks/{todo,history}.md` handoff edits.

### Ship-one-step handoff contract (Step 1.8 → 1.9)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.8**. Do not continue into 1.9.
2. Verify green bar cold across test / typecheck / build.
3. Mark Step 1.8 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Seed Step 1.9's plan (workspace typecheck + build confirmation — mostly a formal gate; may be fast-mergeable into 1.8's output depending on what 1.8 surfaced) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.9 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.9.

---

## (Archived) Phase 1, Step 1.7 — Seed collection YAMLs

### Context

Steps 1.1 through 1.6 have shipped. Phase 1 has its first all-green workspace: `pnpm -w test` 19/19, `pnpm -w -r typecheck` clean, `pnpm --filter @gblockparty/web build` green. The loader plumbing is done but reads from a `contentRoot` argument — no real content directory has been seeded yet. Step 1.7 seeds the three active-collection YAMLs under `content/collections/` per spec §2 so the loader can be pointed at a real tree (and so Phase 2 route work can light up).

### Ship status going in

- **Shipped last session:** `apps/web/src/lib/content/{paths,loader,collections,index}.ts` (sync API per Step 1.3 contract); MDX stubs at `apps/web/src/components/mdx/{YouTube,RepoCard,Callout,AudioPlayer}.tsx`; `gray-matter`, `js-yaml`, `next-mdx-remote`, `@types/js-yaml` installed in `apps/web`.
- **Test status:** `pnpm -w test` exits 0 (19/19 — 14 schema + 5 loader). `pnpm -w -r typecheck` clean. `pnpm --filter @gblockparty/web build` succeeds.
- **No git remote:** local `master` only; `git push` is a local no-op.
- **Deploy:** none.

### What this step does

Seeds three collection YAML files under `content/collections/` (repo-root `content/` directory, which may not yet exist — create it):

1. `content/collections/gcanbuild.yaml`
2. `content/collections/weekly-sota.yaml`
3. `content/collections/weekly-g.yaml`

Each file's shape must satisfy `collectionSchema` (`slug`, `name`, optional `description`, optional `frontDoorUrl`). Spec §2 is the authoritative source for copy — read it before committing wording. No MDX gBlocks in this step — those arrive in Phase 2. The loader already validates YAML, so a quick ad-hoc call from a one-off `node -e` probe (or a throwaway test) confirms the three files parse; do not commit a throwaway test.

### Files to create / modify

- **Create:** `content/collections/gcanbuild.yaml`
- **Create:** `content/collections/weekly-sota.yaml`
- **Create:** `content/collections/weekly-g.yaml`
- **Do not modify:** `packages/**`, `apps/**`, `tasks/**` (except routine handoff edits).

### Approach & key decisions

- **Source of truth:** `specs/gblockparty-v1.md` §2 holds the human-readable names + descriptions for each collection. Copy verbatim — do not paraphrase.
- **`frontDoorUrl`:** if the spec names a destination (e.g. `https://gblockparty.com/gcanbuild`), include it. If not, omit the field — it's optional and nullable.
- **No `content/gblocks/**` seeding:** Phase 2 owns the first real gBlocks. Leaving `content/gblocks/` empty is fine — `loadAllGBlocks` returns `[]` when `<contentRoot>/gblocks` is missing (current implementation short-circuits via `fs.existsSync`).
- **Verification probe:** run `node -e "import('./apps/web/src/lib/content/collections.ts').then(m => console.log(m.loadCollection('gcanbuild', { collectionsRoot: 'content/collections' })))"` or equivalent once to confirm all three parse — optional but cheap.

### Acceptance criteria for Step 1.7

- [ ] `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml` exist with the `slug` / `name` / `description` / `frontDoorUrl?` fields populated per spec §2.
- [ ] Each file parses successfully through `loadCollection()` (verify via probe).
- [ ] `pnpm -w test` still exits 0 (19/19 — no regression).
- [ ] `pnpm -w -r typecheck` still clean.
- [ ] `pnpm --filter @gblockparty/web build` still succeeds.
- [ ] No changes outside `content/collections/**` and routine handoff edits to `tasks/{todo,history}.md`.

### Ship-one-step handoff contract (Step 1.7 → 1.8)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.7**. Do not continue into 1.8.
2. Verify the three YAMLs parse and nothing regresses.
3. Mark Step 1.7 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Seed Step 1.8's plan (green-bar verification — `pnpm -w test` still 0, plus any tidy-up that falls out) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.8 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.8.

---

## (Archived) Phase 1, Step 1.6 — Install MDX tooling + build content loader

### Context

Steps 1.1 (Vitest scaffold), 1.2 (14 failing schema tests), 1.3 (5 failing MDX loader tests), 1.4 (discriminated-union schema — 14/14 green), and 1.5 (playful-brutalist tokens in `globals.css` — `pnpm --filter @gblockparty/web build` passing) have shipped. Step 1.6 is the second green step of Phase 1: turn the Step 1.3 loader suite green by installing the MDX tool-chain and implementing the two loader functions the tests pin (`loadAllGBlocks({ contentRoot })` and `loadCollection(slug, { collectionsRoot })`).

### Ship status going in

- **Shipped last session:** `apps/web/src/app/globals.css` rewritten with the Tailwind v4 `@theme` token block (colors, borders, shadows, radii, typography, motion) + body defaults; `postcss.config.js` unchanged; spec §4 hexes verbatim (`#FFF8E7`, `#0B0B0B`, `#C3F53C`, `#FF6B5B`, `#4D7CFE`, `#EDE4C9`, `#2A2A2A`). No `@font-face`/`next/font` yet — system fallbacks cover the Inter Variable / JetBrains Mono Variable stacks until Step 1.10 polish.
- **Test status:** `pnpm --filter @gblockparty/gblock-schema test` exits 0 (14/14). `pnpm -w test` exits non-zero **only** on the Step 1.3 loader suite (unresolved `../loader` / `../collections`). `pnpm --filter @gblockparty/web build` succeeds (4 static pages, no CSS errors).
- **No git remote:** local `master` only; `git push` is a no-op.
- **Deploy:** none.

### What this step does

1. **Install deps** in `apps/web/package.json`: `gray-matter`, `js-yaml`, `next-mdx-remote`, and `@types/js-yaml` (dev). Keep versions pinned compatible with Next 15.5 / React 19.
2. **Create `apps/web/src/lib/content/paths.ts`** — tiny module exporting the default content roots (e.g. `CONTENT_ROOT = path.resolve(process.cwd(), "content")`, `COLLECTIONS_ROOT = path.resolve(process.cwd(), "content/collections")`). Keep injectable so tests can override via options.
3. **Create `apps/web/src/lib/content/loader.ts`** with `loadAllGBlocks({ contentRoot }: { contentRoot: string }): Promise<GBlock[]>`:
   - Walk `<contentRoot>/gblocks/<collection>/<slug>.mdx` (use `node:fs/promises` + recursive `readdir`, or a small sync walker — the test harness runs synchronously, so either works).
   - `gray-matter` parse each file into `{ data, content }`.
   - `gBlockSchema.parse({ ...data, body: content })` — wrap errors so the thrown message **includes the offending file path** (the Step 1.3 test asserts `/broken-episode.mdx/`).
   - After all files parsed, check for duplicate `slug` across collections → throw an Error whose message names the colliding slug.
   - Return the validated array.
4. **Create `apps/web/src/lib/content/collections.ts`** with `loadCollection(slug: string, { collectionsRoot }: { collectionsRoot: string }): Promise<Collection>`:
   - `fs.readFile(path.join(collectionsRoot, `${slug}.yaml`))`.
   - `js-yaml` parse → `collectionSchema.parse(...)` → return. Let Zod errors bubble (Step 1.3 test asserts throw on invalid YAML).
5. **Create `apps/web/src/lib/content/index.ts`** — barrel re-exporting `loadAllGBlocks`, `loadCollection`, and the content-root constants.
6. **MDX component stubs** at `apps/web/src/components/mdx/{YouTube,RepoCard,Callout,AudioPlayer}.tsx` — minimal props-only placeholder components (render a labeled box). Not exercised by Step 1.3 tests, but in-scope for the mdx-pipeline lane and Phase 1 milestone.

### Files to create / modify

- **Create:** `apps/web/src/lib/content/paths.ts`, `loader.ts`, `collections.ts`, `index.ts`.
- **Create:** `apps/web/src/components/mdx/YouTube.tsx`, `RepoCard.tsx`, `Callout.tsx`, `AudioPlayer.tsx`.
- **Modify:** `apps/web/package.json` (add `gray-matter`, `js-yaml`, `next-mdx-remote` to `dependencies`; `@types/js-yaml` to `devDependencies`).
- **Do not modify:** `packages/**`, `content/**` (Step 1.7 seeds collection YAMLs), `apps/web/src/app/**`, `apps/web/src/lib/content/__tests__/**` (fixtures + tests are frozen), `tasks/**` (except routine handoff edits).

### Approach & key decisions

- **Async vs sync:** the Step 1.3 tests call the loader directly from `it()` blocks — verify whether they `await` before committing to an API shape. If they await, keep `Promise<…>`. If they call synchronously, use sync `fs` calls and return plain values.
- **Body field:** Step 1.3's "parses frontmatter + body content" assertion likely checks a field on the returned object. Inspect the test to confirm the exact key (`body`, `content`, or similar) and mirror it. Do **not** invent a field that the test doesn't check.
- **Error wrapping:** `try { gBlockSchema.parse(data) } catch (err) { throw new Error(\`\${relativeFilePath}: \${err.message}\`) }` — the test uses `toThrow(/broken-episode\.mdx/)`, so the path fragment must appear in `err.message`.
- **Duplicate-slug check:** build a `Map<slug, filePath>` as you iterate; on collision, throw including both paths and the slug.
- **Import path from schema:** `@gblockparty/gblock-schema` is a workspace package — prefer its public `gBlockSchema` / `GBlock` / `collectionSchema` / `Collection` exports over deep imports.
- **Zod 3.25 discriminated-union caveat:** the schema uses a union-level `.superRefine()` for `episode` video-or-audio — `gBlockSchema.parse(...)` still works identically; loader doesn't need to know. Flagged in case a parse error shape is surprising.
- **No YAML parsing for MDX files; no MDX parsing for YAML.** Keep the two loaders strictly separate.
- **Next.js server-only:** mark loader files with `import "server-only"` only if it doesn't trip up Vitest. Tests run in a Node env, so vanilla `fs` usage should be fine — verify before adding the guard.

### Acceptance criteria for Step 1.6

- [ ] `pnpm --filter @gblockparty/web test` exits 0 (all 5 loader cases green).
- [ ] `pnpm --filter @gblockparty/gblock-schema test` still exits 0 (no regression).
- [ ] `pnpm -w test` exits 0.
- [ ] `pnpm -w -r typecheck` passes across the workspace (loader + web app both clean).
- [ ] `pnpm --filter @gblockparty/web build` still succeeds.
- [ ] No changes to `packages/**`, `content/**`, `apps/web/src/app/**`, or the Step 1.3 test file + fixtures.
- [ ] New deps recorded in `apps/web/package.json`; lockfile updated.

### Ship-one-step handoff contract (Step 1.6 → 1.7)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.6**. Do not continue into 1.7.
2. Verify the 5 loader tests are green and nothing else regressed.
3. Mark Step 1.6 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Seed Step 1.7's plan (seed `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml` per spec §2) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.7 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.7.

---

## (Archived) Phase 1, Step 1.5 — Playful-brutalist design tokens in `globals.css`

### Context

Phase 1 has shipped Steps 1.1 (Vitest scaffold), 1.2 (14 failing schema tests), 1.3 (5 failing MDX loader tests), and 1.4 (discriminated-union schema — 14 schema tests green). Loader tests from Step 1.3 remain red; Step 1.6 owns them. Step 1.5 is a parallel, implementation-safe lane (no test coupling, no package-schema dependency): author the playful-brutalist token set in `apps/web/src/app/globals.css` per spec §4, exposed via a Tailwind v4 `@theme { ... }` block so utilities like `bg-bg`, `text-ink`, `shadow-brutal` become generated.

### Ship status going in

- **Shipped last session:** `packages/gblock-schema/src/index.ts` rewritten to `z.discriminatedUnion("type", [...])` with 8 variants, shared-base fields, `episode` video-or-audio enforced via union-level `.superRefine()` (Zod 3.25 does not accept ZodEffects inside `discriminatedUnion`). Test helper factories at `packages/gblock-schema/src/__tests__/schema.test.ts` switched to generic overrides so destructures typecheck. Tests, history, todo updated.
- **Test status:** `pnpm --filter @gblockparty/gblock-schema test` exits 0 (14/14). `pnpm -w test` exits non-zero **only** on the Step 1.3 loader suite (unresolved `../loader` / `../collections`). `pnpm -w -r typecheck` — schema package clean; `apps/web` still fails on the same loader imports (Step 1.6 scope).
- **No git remote:** local `master` only; `git push` is a no-op.
- **Deploy:** none.

### What this step does

Replaces the placeholder comment block in `apps/web/src/app/globals.css` with a concrete token set per spec §4 (color palette — bg, ink, paper, primary, accent, surface; borders — 2px/3px hard offsets; shadows — `--shadow-brutal` hard-offset no-blur stack; radii — 0 or very small; typography — Inter Variable body, JetBrains Mono Variable code, optional display face; motion — stepped/stiff). Wires them through Tailwind v4's `@theme { ... }` syntax so utilities are generated (`bg-bg`, `text-ink`, `border-ink`, `shadow-brutal`, etc.). Sets body defaults (background, text color, base font).

### Files to create / modify

- **Modify:** `apps/web/src/app/globals.css` (replace the TODO comment with the full token set + `@theme` block + body defaults).
- **Modify (if needed):** `apps/web/postcss.config.js` — only if Tailwind v4 `@theme` requires a config change over the existing setup; verify first.
- **Do not modify:** `packages/**`, `content/**`, `apps/web/src/lib/**`, `tasks/**` (except routine handoff edits), or any component files.

### Approach & key decisions

- Tailwind v4 uses `@theme { --color-bg: ...; }` inside the CSS file itself — no `tailwind.config.*` required. Keep config inline.
- Prefer `next/font` for Inter Variable + JetBrains Mono Variable only if it's cleaner; otherwise `@font-face` + `font-family` tokens is fine for this step (fonts can be revisited in Step 1.10 refactor).
- Hard-offset brutalist shadow: e.g. `--shadow-brutal: 4px 4px 0 0 var(--color-ink)`.
- Stepped motion: define `--ease-brutal: steps(4, end)` or similar; no easing blur.
- No component styling — tokens only. Components land in Phase 2.

### Acceptance criteria for Step 1.5

- [ ] `apps/web/src/app/globals.css` exports a complete token set: colors (bg, ink, paper, primary, accent, surface), borders (hard width + ink color), shadows (at least `--shadow-brutal`), radii, typography (font-family + scale), motion (stepped easing).
- [ ] Tokens live in a Tailwind v4 `@theme { ... }` block so `bg-bg`, `text-ink`, `shadow-brutal` etc. resolve as utilities.
- [ ] Body defaults (background, text color, base font) applied.
- [ ] `pnpm --filter @gblockparty/web build` succeeds (no CSS syntax errors).
- [ ] `pnpm --filter @gblockparty/gblock-schema test` still exits 0 (no regression).
- [ ] No changes outside `apps/web/src/app/globals.css` (and `postcss.config.js` only if strictly required).

### Ship-one-step handoff contract (Step 1.5 → 1.6)

After approval, the clear-context implementation session must:

1. Implement **only Step 1.5**. Do not continue into 1.6.
2. Verify `pnpm --filter @gblockparty/web build` passes.
3. Mark Step 1.5 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op — flag the missing remote).
6. Deploy: none.
7. Write Step 1.6's plan (install MDX tooling + build content loader to turn the Step 1.3 loader tests green) into `tasks/todo.md` as a self-contained block.
8. `.claude/settings.local.json` is already compliant; do not re-edit unless a key is missing.
9. Start the approval UI for Step 1.6 by calling `EnterPlanMode` first, then writing a brief pass-through plan, then `ExitPlanMode`.
10. Stop before implementing Step 1.6.

---

## (Archived) Phase 1, Step 1.4 — Migrate schema to discriminated union (first green step)

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
- [x] Step 1.5: Write playful-brutalist design tokens _(Lane: design-tokens)_ — shipped 2026-04-24. `apps/web/src/app/globals.css` holds the full `@theme` token set (color/border/shadow/radius/typography/motion) + body defaults; `postcss.config.js` untouched. Mirror entry below (now checked).
- [x] Step 1.4: Migrate schema to discriminated union _(Lane: schema)_
  - Files: modify `packages/gblock-schema/src/index.ts`
  - Build per-type schemas by extending a shared-field base. `episode` uses `.refine()` to require at least one of `videoUrl`/`audioUrl`. `stream` requires `videoUrl` + `startedAt`. `clip` requires `videoUrl` + optional `parentSlug?`. `repo` requires `repoUrl`. `tool`/`demo` require `demoUrl`. `tutorial`/`essay` add optional `readingTimeMinutes?`. Export `gBlockSchema = z.discriminatedUnion("type", […])`.
- [x] Step 1.5: Write playful-brutalist design tokens _(Lane: design-tokens)_ — shipped 2026-04-24.
- [x] Step 1.6: Install MDX tooling + build content loader _(Lane: mdx-pipeline)_ — shipped 2026-04-24. Deps added to `apps/web/package.json`; sync loader at `apps/web/src/lib/content/{paths,loader,collections,index}.ts` (body attached post-parse — schema has no `body` field); MDX component stubs at `apps/web/src/components/mdx/{YouTube,RepoCard,Callout,AudioPlayer}.tsx`. 5/5 loader tests green; `pnpm -w test` 19/19 green for the first time in Phase 1.
- [x] Step 1.7: Seed collection YAMLs _(Lane: mdx-pipeline)_ — shipped 2026-04-24. `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml` seeded with verbatim spec §2 descriptions; `frontDoorUrl` omitted (spec doesn't name one); pre-existing `boston-founder-radio.yaml` left alone (Phase 4 decommission, separate follow-up). Verified via one-off `node --input-type=module` probe that `collectionSchema.parse(yaml.load(...))` accepts all three. `pnpm -w test` 19/19 green; typecheck + build unchanged.

### Green
- [x] Step 1.8: `pnpm -w test` — all Phase 1 tests green. Shipped 2026-04-24 — cold cache-bypassed run (`pnpm turbo run test typecheck --force`) 19/19 test + clean typecheck, `pnpm --filter @gblockparty/web build` 4/4 static pages; probes confirmed `loadCollection()` resolves all three real slugs and `loadAllGBlocks({ contentRoot: "content" })` returns `[]`. No tidy-up surfaced.
- [x] Step 1.9: `pnpm -w -r typecheck && pnpm --filter @gblockparty/web build` — clean. Shipped 2026-04-24 — cold cache-bypassed typecheck (2 packages clean), cold build (4/4 static pages). Formal gate passed.
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
