# Roadmap: gBlockParty v1

> Generated from: `specs/gblockparty-v1.md`, `specs/gblockparty-v1-interview.md`, `README.md`
> Date: 2026-04-24
> Total Phases: 4

## Summary

Four phases move gBlockParty from scaffold to live site. P1 builds the foundation (schema, tokens, MDX pipeline) in parallel lanes. P2 layers the UI (routes, home, collection and gBlock pages, inactive paywall). P3 is the launch: author 5 canary gBlocks, deploy to Vercel, point the domain. P4 is polish: analytics, nightly YT scraper, and the lexcorp-war-room portfolio rollup. The launch gate is three concrete checks: all 5 canaries live, `gblockparty.com` resolves to the Vercel deploy, and `featured: true` pins to the home hero rail.

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Foundation | §5 Data Model, §4 Visual System, §6 Content Authoring | Schema (discriminated union + new types), design tokens, MDX pipeline | M |
| 2 | UI Surface | §3 Information Architecture, §7 Membership | Routes, home (featured + firehose + shorts), collection/gBlock pages, paywall card | M |
| 3 | Launch | §8 Migration Canaries, §10 Build & Deploy | 5 canary gBlocks, Vercel deploy, `gblockparty.com` domain resolving | M |
| 4 | Polish | §9 Performance Signals, §10, §7 | Plausible analytics, YT view scraper, lexcorp-war-room rollup, paywall polish | S |

---

## Phase 1: Foundation

**Goal**: Establish the content and design primitives every later phase depends on — the validated schema, the playful-brutalist token set, and a working MDX loader — so that gBlock authoring and page rendering can proceed independently.

**Scope**:
- Convert `packages/gblock-schema` from flat enum to `z.discriminatedUnion("type", …)` with type-specific required fields (per §5).
- Add types `clip` and `stream`; add shared fields `heroImage`, `videoUrl`, `featured`, `seriesSlug`.
- Write playful-brutalist design tokens into `apps/web/src/app/globals.css` — color, border/shadow, radius, typography, motion (per §4).
- Build the MDX pipeline at `apps/web/src/lib/content/*`: file discovery under `content/gblocks/<collection>/<slug>.mdx`, frontmatter parse, Zod validation against the new schema, collection-YAML validation.
- Seed `content/collections/{gcanbuild,weekly-sota,weekly-g}.yaml`.
- Expose a handful of MDX components for use in bodies: `<YouTube>`, `<RepoCard>`, `<Callout>`, `<AudioPlayer>` (stub).

**Acceptance Criteria:**
- [ ] `packages/gblock-schema` exports a Zod discriminated union with all 8 types; `pnpm typecheck` passes across the monorepo.
- [ ] Per-type required fields enforced: `episode` requires `videoUrl` or `audioUrl`; `stream` requires `videoUrl` + `startedAt`; `clip` requires `videoUrl`; `repo` requires `repoUrl`; `tool`/`demo` require `demoUrl`.
- [ ] `apps/web/src/app/globals.css` defines the full token set (colors, borders, shadows, radii, typography) as CSS custom properties accessible via Tailwind v4 utilities.
- [ ] A unit test (or equivalent validation script) successfully parses and validates a sample MDX frontmatter for each of the 3 active collections.
- [ ] Invalid frontmatter (e.g., `episode` without video or audio) fails validation with a clear error.
- [ ] `content/collections/gcanbuild.yaml`, `weekly-sota.yaml`, `weekly-g.yaml` exist and validate against `collectionSchema`.

**Manual Tasks** (if any):
- _(none — all work is automatable via file edits + typechecks + validation tests)_

**Parallelization:** implementation-safe

**Coordination Notes:** Three lanes with non-overlapping write ownership.
- Lane A — schema: `packages/gblock-schema/**`.
- Lane B — design tokens: `apps/web/src/app/globals.css`, `apps/web/postcss.config.js` if needed.
- Lane C — MDX pipeline + collection YAMLs: `apps/web/src/lib/content/**`, `content/collections/**`.
Lane C imports from Lane A but waits on Lane A's exported types only (can stub against the draft schema early). No file-write conflicts between lanes.

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
  - Scope: Convert flat enum to discriminated union with `clip`/`stream` types and per-type required fields. Export union type + per-type types. Keep backwards-compatible `gBlockTypeSchema` export shape if feasible.
  - Owns: `packages/gblock-schema/**`
  - Must not edit: `apps/**`, `content/**`, `tasks/**`
  - Depends on: Step 1.1 (test scaffolding) for failing tests to run against
  - Deliverable: updated `packages/gblock-schema/src/index.ts`, passing per-type validation tests, summary of exported types
- Lane: design-tokens
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Write playful-brutalist tokens per spec §4 into `globals.css`; ensure Tailwind v4 can consume tokens via `@theme` or CSS custom properties per Tailwind v4 conventions.
  - Owns: `apps/web/src/app/globals.css`, `apps/web/postcss.config.js`
  - Must not edit: `packages/**`, `content/**`, `apps/web/src/lib/**`, `tasks/**`
  - Depends on: none
  - Deliverable: updated `globals.css` with full token set, screenshot/description of rendered sample, confirmation `pnpm --filter @gblockparty/web build` succeeds
- Lane: mdx-pipeline
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Install MDX deps; build content loader that discovers files, parses frontmatter (gray-matter), validates against schema, resolves collection YAMLs. Expose MDX components stubs.
  - Owns: `apps/web/src/lib/content/**`, `apps/web/src/components/mdx/**`, `content/collections/**`, `apps/web/package.json` (deps only)
  - Must not edit: `packages/**`, `apps/web/src/app/**`, `tasks/**`, `apps/web/src/app/globals.css`
  - Depends on: schema lane (exported types)
  - Deliverable: working `loadAllGBlocks()` + `loadCollection()` functions, 3 collection YAMLs, MDX component stubs, passing frontmatter-validation tests

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

### Tests First
- Step 1.1: Set up Vitest as the monorepo test runner
  - Files: create `vitest.config.ts` at repo root, add `vitest` + `@vitest/ui` to root `devDependencies` in `package.json`, add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to root `package.json` and `packages/gblock-schema/package.json`
  - Rationale: no test framework exists yet; both schema and MDX pipeline need unit tests
- Step 1.2: Write failing schema validation tests
  - Files: create `packages/gblock-schema/src/__tests__/schema.test.ts`
  - Cases: valid `tutorial` frontmatter passes; valid `essay` passes; `episode` without both `videoUrl` and `audioUrl` fails with clear error; `episode` with only `videoUrl` passes; `episode` with only `audioUrl` passes; `stream` missing `videoUrl` fails; `stream` missing `startedAt` fails; `clip` missing `videoUrl` fails; `repo` missing `repoUrl` fails; `tool` missing `demoUrl` fails; `demo` missing `demoUrl` fails; unknown `type` fails; optional shared fields (`heroImage`, `featured`, `seriesSlug`, `videoUrl`) accepted on any type; `membership` defaults to `"free"` when omitted
  - Expected state: tests fail (red) because schema is still flat
- Step 1.3: Write failing MDX pipeline tests
  - Files: create `apps/web/src/lib/content/__tests__/loader.test.ts`
  - Cases: `loadAllGBlocks()` discovers fixture files under `content/gblocks/<collection>/<slug>.mdx`; parses frontmatter + body; rejects invalid frontmatter with file path in error; `loadCollection("gcanbuild")` reads and validates `content/collections/gcanbuild.yaml`; duplicate slugs across different collections throw a collision error
  - Include small fixture content under `apps/web/src/lib/content/__tests__/fixtures/` (1 valid gBlock per active type, 1 intentionally invalid)
  - Expected state: tests fail (red) because the loader does not exist

### Implementation
- Step 1.4: Migrate schema to discriminated union (Lane: schema)
  - Files: modify `packages/gblock-schema/src/index.ts`
  - Add `gBlockTypeSchema` to include `clip` and `stream`. Add shared-field schema (`sharedBlockFields`) with `slug`, `collection`, `title`, `summary?`, `publishedAt?`, `canonicalUrl?`, `crossPosts?`, `tags?`, `membership` (default `"free"`), `heroImage?`, `videoUrl?`, `featured?`, `seriesSlug?`.
  - Build per-type schemas with `sharedBlockFields.extend({ type: z.literal("..."), ... })` adding required fields: `episode` needs at least one of `videoUrl`/`audioUrl` (use `.refine()`); `stream` requires `videoUrl` + `startedAt`; `clip` requires `videoUrl`, optional `parentSlug?`; `repo` requires `repoUrl`; `tool`/`demo` require `demoUrl`; `tutorial`/`essay` optionally add `readingTimeMinutes?`.
  - Export `gBlockSchema = z.discriminatedUnion("type", [...])`; keep `GBlock` type alias.
  - Keep `collectionSchema` unchanged.
- Step 1.5: Write playful-brutalist design tokens (Lane: design-tokens)
  - Files: modify `apps/web/src/app/globals.css`
  - Define CSS custom properties per spec §4: color tokens (`--color-bg`, `--color-ink`, `--color-accent-lime`, `--color-accent-coral`, `--color-accent-blue`, `--color-muted`, `--color-ink-soft`), radius scale (`--radius-sm/md/lg`), border/shadow tokens, typography stack (load Inter Variable + JetBrains Mono Variable via `@font-face` or `next/font`).
  - Use Tailwind v4's `@theme { ... }` block so utilities like `bg-bg`, `text-ink`, `shadow-brutal` are generated.
  - Set body defaults: `background-color: var(--color-bg); color: var(--color-ink); font-family: var(--font-body);`
- Step 1.6: Install MDX tooling + build content loader (Lane: mdx-pipeline)
  - Files: modify `apps/web/package.json` (add `gray-matter`, `next-mdx-remote`, `js-yaml`, `@types/js-yaml`); create `apps/web/src/lib/content/paths.ts`, `loader.ts`, `collections.ts`, `index.ts`; create `apps/web/src/components/mdx/YouTube.tsx`, `RepoCard.tsx`, `Callout.tsx`, `AudioPlayer.tsx` (stub)
  - `paths.ts`: `CONTENT_ROOT` constant pointing at `content/`.
  - `loader.ts`: `loadAllGBlocks()` walks `content/gblocks/<collection>/<slug>.mdx`, reads, parses frontmatter, runs through `gBlockSchema.parse()` — wrap errors with file path; asserts slug uniqueness across the entire set.
  - `collections.ts`: `loadCollection(slug)` reads `content/collections/<slug>.yaml`, parses with `js-yaml`, validates with `collectionSchema`.
  - MDX components: functional stubs that render expected markup but can evolve in Phase 2 (e.g. `<YouTube id>` renders an `<iframe>` with lite YouTube embed).
- Step 1.7: Seed collection YAMLs (Lane: mdx-pipeline)
  - Files: create `content/collections/gcanbuild.yaml`, `weekly-sota.yaml`, `weekly-g.yaml`
  - Per spec §2. Example for gcanbuild: `slug: gcanbuild`, `name: "GCanBuild"`, `description: "Full-stack build tutorials. Stack-forward, monolithic, SEO-loaded."`, `frontDoorUrl: null`.

### Green
- Step 1.8: Run full test suite and verify green
  - Command: `pnpm -w test`
  - Expected: all tests from Steps 1.2 + 1.3 pass; no regressions.
- Step 1.9: Run typecheck + build
  - Commands: `pnpm -w -r typecheck && pnpm --filter @gblockparty/web build`
  - Expected: typecheck clean, Next.js production build succeeds; globals.css compiles through Tailwind v4 without warnings.
- Step 1.10: Refactor if needed while keeping tests green
  - Scope: consolidate any duplicated Zod field definitions; extract shared-field helper if it makes per-type schemas cleaner; consolidate MDX component exports in a single barrel.

### Milestone: Phase 1 Foundation Ready

**Acceptance Criteria:** (preserved from roadmap)
- [ ] `packages/gblock-schema` exports a Zod discriminated union with all 8 types; `pnpm typecheck` passes across the monorepo.
- [ ] Per-type required fields enforced: `episode` requires `videoUrl` or `audioUrl`; `stream` requires `videoUrl` + `startedAt`; `clip` requires `videoUrl`; `repo` requires `repoUrl`; `tool`/`demo` require `demoUrl`.
- [ ] `apps/web/src/app/globals.css` defines the full token set (colors, borders, shadows, radii, typography) as CSS custom properties accessible via Tailwind v4 utilities.
- [ ] A unit test (or equivalent validation script) successfully parses and validates a sample MDX frontmatter for each of the 3 active collections.
- [ ] Invalid frontmatter (e.g., `episode` without video or audio) fails validation with a clear error.
- [ ] `content/collections/gcanbuild.yaml`, `weekly-sota.yaml`, `weekly-g.yaml` exist and validate against `collectionSchema`.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests. _(None yet — this is the first phase with tests.)_

---

## Phase 2: UI Surface

**Goal**: Render the site. Ship every page type the spec calls for, with the inactive paywall scaffold in place, so that Phase 3 only has to add content and deploy.

**Scope**:
- App Router routes:
  - `/` — home with featured rail, firehose feed, filters (type + collection), shorts rail placeholder.
  - `/<collection>` — collection page with hero + gBlock grid + type/date filters + series grouping when `seriesSlug` is shared.
  - `/<collection>/<slug>` — gBlock page with type-specific header (tutorial/essay = hero+title; episode/stream/clip = embedded video; repo/tool/demo = linked card) + MDX body.
  - `/g/<slug>` — 301 redirect to the canonical `/<collection>/<slug>`.
  - `/t/<tag>` — stub route (returns 404 or placeholder; reserved URL pattern).
- Components (shared, file-scoped):
  - `GBlockCard` (used on home + collection + related rails).
  - `FeaturedRail` (home hero, consumes `featured: true`).
  - `FirehoseFeed` (reverse-chron list with filters).
  - `ShortsRail` (horizontal `clip`-type rail).
  - `TypeBadge` / `CollectionBadge`.
  - `PaywallCard` (wired but renders nowhere in Phase 1 because no gBlock has `membership: member`).
- Global slug-uniqueness check at build time (error if two gBlocks collide).

**Acceptance Criteria:**
- [ ] `/` renders featured rail + firehose + (empty-state) shorts rail when the repo has any gBlocks authored; empty state is graceful when there are none.
- [ ] `/<collection>` renders for each of `gcanbuild`, `weekly-sota`, `weekly-g` even with zero or one gBlock seeded.
- [ ] `/<collection>/<slug>` renders a type-appropriate header: video embed for `episode`/`stream`/`clip`, hero image for `tutorial`/`essay`, linked card for `repo`/`tool`/`demo`.
- [ ] `/g/<slug>` issues a 301 to the canonical URL and resolves correctly for every authored slug.
- [ ] `featured: true` pins gBlocks to the featured rail in the order defined (stable sort by `publishedAt` desc within pinned set).
- [ ] Slug uniqueness enforced at build: duplicate slugs across collections fail the build with a clear error.
- [ ] `PaywallCard` renders correctly when forced against a fixture `membership: member` gBlock (fixture-only; no real gated content ships).
- [ ] `pnpm build` in `apps/web` produces a production build with no TS or lint errors.

**Manual Tasks** (if any):
- _(none)_

**Parallelization:** implementation-safe

**Coordination Notes:** Each route file and each component file is its own write lane. Shared dependencies: schema types (frozen after Phase 1) and design tokens (frozen after Phase 1). Recommended lane split:
- Lane A — routes: `apps/web/src/app/**` (the four route files + the redirect handler).
- Lane B — presentational components: `apps/web/src/components/GBlockCard.tsx`, `FeaturedRail.tsx`, `FirehoseFeed.tsx`, `ShortsRail.tsx`, `TypeBadge.tsx`, `CollectionBadge.tsx`.
- Lane C — paywall + membership scaffold: `apps/web/src/components/PaywallCard.tsx`, any membership-context utility.
Build the components first (Lane B) as a micro-serial preamble; then Lanes A + C run in parallel.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** implementation-safe
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, UX

**Subagent lanes:**
- Lane: components
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Build all shared presentational components (GBlockCard, TypeBadge, CollectionBadge, FeaturedRail, FirehoseFeed, ShortsRail). Consume design tokens from globals.css. Consume GBlock/Collection types from schema.
  - Owns: `apps/web/src/components/*.tsx` (excluding `mdx/` and `PaywallCard.tsx`)
  - Must not edit: `packages/**`, `content/**`, `apps/web/src/app/**`, `apps/web/src/lib/**`, `tasks/**`
  - Depends on: Step 2.1 (fixture gBlocks for visual dev)
  - Deliverable: 6 working components with playful-brutalist styling
- Lane: routes
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Build all App Router routes (home, collection, gBlock detail, redirect, tag stub). Wire components to content loader. Add SEO metadata.
  - Owns: `apps/web/src/app/**` (route files only — layout.tsx, page.tsx, dynamic routes)
  - Must not edit: `packages/**`, `apps/web/src/components/**`, `tasks/**`
  - Depends on: components lane (Step 2.2–2.3)
  - Deliverable: all 5 route patterns functional with content loaded from MDX
- Lane: paywall
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Build PaywallCard component and membership-gating display logic.
  - Owns: `apps/web/src/components/PaywallCard.tsx`
  - Must not edit: `packages/**`, `content/**`, `apps/web/src/app/**`, `apps/web/src/lib/**`, `tasks/**`
  - Depends on: none
  - Deliverable: PaywallCard component that renders for `membership: member` gBlocks

### Implementation
- Step 2.1: Seed development fixture gBlocks
  - Files: create `content/gblocks/gcanbuild/pastebin-clone-nextjs.mdx`, `content/gblocks/gcanbuild/better-auth-tutorial.mdx`, `content/gblocks/weekly-sota/sota-ep-001.mdx`, `content/gblocks/weekly-g/weekly-g-ep-001.mdx`, `content/gblocks/gcanbuild/streaming-highlight-clip.mdx`
  - 5 fixture gBlocks exercising 3 types across all 3 collections: 2 tutorials (gcanbuild, 1 with `featured: true`), 1 episode (weekly-sota, `videoUrl`), 1 episode (weekly-g, `featured: true`), 1 clip (gcanbuild, for shorts rail). Each has minimal MDX body using at least one `<YouTube>`, `<Callout>`, or `<RepoCard>` stub. All validate against `gBlockSchema`.
- Step 2.2: Shared UI primitives — GBlockCard, TypeBadge, CollectionBadge _(Lane: components)_
  - Files: create `apps/web/src/components/GBlockCard.tsx`, `apps/web/src/components/TypeBadge.tsx`, `apps/web/src/components/CollectionBadge.tsx`
  - `GBlockCard`: card with brutal border + shadow, hero image (or type-colored placeholder), title, type badge, collection badge, published date. Links to `/<collection>/<slug>`. Hover: translate + shadow bump per spec §4.
  - `TypeBadge`: small pill with type name, colored by type (accent-coral for video types, accent-blue for code types, ink for text types).
  - `CollectionBadge`: small pill linking to `/<collection>` with collection name.
- Step 2.3: Home page components — FeaturedRail, FirehoseFeed, ShortsRail _(Lane: components)_
  - Files: create `apps/web/src/components/FeaturedRail.tsx`, `apps/web/src/components/FirehoseFeed.tsx`, `apps/web/src/components/ShortsRail.tsx`
  - `FeaturedRail`: horizontal row of 1–3 `GBlockCard`s filtered by `featured: true`, sorted by `publishedAt` desc. Graceful empty state.
  - `FirehoseFeed`: reverse-chron list of all gBlocks with `GBlockCard`, plus type and collection filter chips. Graceful empty state.
  - `ShortsRail`: horizontal scroll of `clip`-type gBlocks. Hidden when no clips exist.
- Step 2.4: Home page route _(Lane: routes)_
  - Files: modify `apps/web/src/app/page.tsx`
  - Server component that calls `loadAllGBlocks()` and renders `FeaturedRail` + `FirehoseFeed` + `ShortsRail`. Graceful empty state when no gBlocks exist.
- Step 2.5: Collection page route _(Lane: routes)_
  - Files: create `apps/web/src/app/[collection]/page.tsx`
  - `generateStaticParams()` returns the 3 active collections. Server component loads collection YAML (hero name + description) + all gBlocks for that collection. Renders collection hero, gBlock grid with type/date filters, series grouping when `seriesSlug` is shared. Graceful empty state.
- Step 2.6: gBlock detail page route with MDX rendering _(Lane: routes)_
  - Files: create `apps/web/src/app/[collection]/[slug]/page.tsx`; may modify `apps/web/src/components/mdx/*.tsx` (upgrade stubs to render real content)
  - `generateStaticParams()` returns all `{ collection, slug }` pairs. Type-specific header block: `tutorial`/`essay` → hero image + title + reading time; `episode`/`stream`/`clip` → YouTube embed via `<iframe>` + title; `repo`/`tool`/`demo` → linked card with URL + title. MDX body rendered via `next-mdx-remote`. SEO metadata: `<title>`, `<meta name="description">`, Open Graph tags derived from frontmatter.
- Step 2.7: Redirect `/g/<slug>` + stub `/t/<tag>` _(Lane: routes)_
  - Files: create `apps/web/src/app/g/[slug]/route.ts`, create `apps/web/src/app/t/[tag]/page.tsx`
  - `/g/<slug>`: Route handler that looks up the gBlock by slug, returns 301 redirect to `/<collection>/<slug>`. Returns 404 if slug not found.
  - `/t/<tag>`: Placeholder page (reserved URL pattern, renders "Tag pages coming soon" or 404).
- Step 2.8: PaywallCard component _(Lane: paywall)_
  - Files: create `apps/web/src/components/PaywallCard.tsx`
  - Renders a CTA card for `membership: member` gBlocks. Shows first ~150 words of body as preview, then a paywall overlay with sign-up CTA. Uses brutal border + muted background per spec §4. Wired into gBlock detail page but only renders when `membership === "member"` — at launch, no gBlocks have this, so it renders nowhere in production.
- Step 2.9: Build-time slug uniqueness + SEO metadata polish
  - Files: may modify `apps/web/next.config.ts` or `apps/web/src/app/layout.tsx`; modify `apps/web/src/app/[collection]/[slug]/page.tsx` (if SEO not fully wired in 2.6)
  - Slug uniqueness: `loadAllGBlocks()` already throws on duplicate slugs; verify this surfaces as a build failure via `generateStaticParams()`. Add an explicit check in the build pipeline if the loader error doesn't propagate cleanly.
  - SEO: ensure every page has a meaningful `<title>`, `<meta name="description">`, and Open Graph `og:title`/`og:description`/`og:image` derived from frontmatter or collection metadata.

### Green
- Step 2.10: Write regression tests covering acceptance criteria
  - Files: create `apps/web/src/__tests__/pages.test.ts` or similar
  - Cases: `loadAllGBlocks()` returns the 5 fixture gBlocks with correct types; featured filter returns only `featured: true` blocks sorted by `publishedAt` desc; clip filter returns only clip-type blocks; redirect lookup resolves slug to canonical `/<collection>/<slug>`; `PaywallCard` renders when `membership === "member"` (fixture-only); slug uniqueness throws on duplicates (already covered by Phase 1 tests — verify no regression).
- Step 2.11: Run all tests, typecheck, build — verify green; refactor if needed
  - Commands: `pnpm -w test`, `pnpm -w -r typecheck`, `pnpm --filter @gblockparty/web build`
  - Expected: all tests pass (Phase 1 + Phase 2), typecheck clean, production build succeeds with all fixture gBlock pages generated.

### Milestone: Phase 2 UI Surface Ready

**Acceptance Criteria:** (preserved from roadmap)
- [ ] `/` renders featured rail + firehose + (empty-state) shorts rail when the repo has any gBlocks authored; empty state is graceful when there are none.
- [ ] `/<collection>` renders for each of `gcanbuild`, `weekly-sota`, `weekly-g` even with zero or one gBlock seeded.
- [ ] `/<collection>/<slug>` renders a type-appropriate header: video embed for `episode`/`stream`/`clip`, hero image for `tutorial`/`essay`, linked card for `repo`/`tool`/`demo`.
- [ ] `/g/<slug>` issues a 301 to the canonical URL and resolves correctly for every authored slug.
- [ ] `featured: true` pins gBlocks to the featured rail in the order defined (stable sort by `publishedAt` desc within pinned set).
- [ ] Slug uniqueness enforced at build: duplicate slugs across collections fail the build with a clear error.
- [ ] `PaywallCard` renders correctly when forced against a fixture `membership: member` gBlock (fixture-only; no real gated content ships).
- [ ] `pnpm build` in `apps/web` produces a production build with no TS or lint errors.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

---

## Phase 3: Launch

**Goal**: Put gblockparty.com on the internet with real content. This is the launch gate.

**Scope**:
- Author 5 canary MDX gBlocks:
  - 3 × GCanBuild tutorials mined from existing top YouTube videos (Better Auth / Full-Stack tutorial / Pastebin Clone). MDX contains: summary, linked `<YouTube>` embed, section-by-section walkthrough synthesized from the video outline, code blocks, tags, `heroImage`, `featured: true` on at least the Pastebin canary.
  - 1 × Weekly SOTA pilot — either reframe the existing "Sam Altman" commentary as SOTA Ep 1 with fresh show notes, or record a new Ep 1 (user's call at authoring time).
  - 1 × Weekly G Ep 1 — fresh recording + vlog-style MDX write-up. `featured: true`.
- Create `GeorgeQLe/gblockparty` GitHub repo (via `gh` CLI) and push `master`.
- Create Vercel project linked to the repo (via `vercel` CLI).
- Configure `gblockparty.com` apex domain in Vercel.
- Add DNS records at the domain registrar to point `gblockparty.com` at Vercel.
- Verify HTTPS cert issues and the live site renders the 5 canaries.

**Acceptance Criteria:**
- [ ] All 5 canary MDX files exist under `content/gblocks/<collection>/<slug>.mdx` and validate against the Phase-1 schema.
- [ ] `https://gblockparty.com` resolves to the Vercel deploy with a valid TLS cert.
- [ ] Home page shows featured-rail pins for the `featured: true` canaries and the firehose lists all 5.
- [ ] Each of the 3 collection pages (`/gcanbuild`, `/weekly-sota`, `/weekly-g`) lists its canary.
- [ ] Each canary `/<collection>/<slug>` URL renders correctly with type-appropriate header (video embed on SOTA + Weekly G, hero image on GCanBuild tutorials).
- [ ] `/g/<slug>` short-links for all 5 canaries 301 to canonical URLs.

**Manual Tasks:**
- Record Weekly G Ep 1 video + supporting assets _(blocks: canary authoring for Weekly G)_ — content creation, no automatable path.
- Decide SOTA pilot strategy: reframe existing Sam Altman commentary vs. record fresh Ep 1 _(blocks: SOTA canary authoring)_ — user judgment + possible new recording.
- Add DNS records for `gblockparty.com` at the domain registrar _(blocks: Step 3.final — domain resolution check)_ — registrar dashboard, no reliable authenticated CLI path.
- Confirm `gh` CLI and `vercel` CLI are authenticated before the automatable repo/project creation runs _(blocks: Vercel project creation)_.

**Parallelization:** serial

**Coordination Notes:** Strategic work and deploy steps are sequential by nature (repo → project → domain → DNS → verify). Canary authoring can parallelize across the 5 files, but each is small; the real bottleneck is the manual content-creation tasks. Keep serial to avoid premature deploys before content lands.

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

---

## Phase 4: Polish

**Goal**: Post-launch instrumentation, performance-signal plumbing, and the cross-repo portfolio rollup. These aren't launch-critical but close out the Phase-1 scope from the spec.

**Scope**:
- Embed Plausible analytics in `apps/web/src/app/layout.tsx`.
- Build the nightly YouTube view-count scraper as a GitHub Action: scrape channel HTML via the same technique used during `/spec-interview`, commit `data/youtube-views.json` snapshot, trigger Vercel rebuild so gBlock pages can surface fresh view counts.
- Cross-repo edits to `lexcorp-war-room`:
  - Decommission `portfolio/boston-founder-radio.yaml` (move to `portfolio/archive/` or delete per that repo's convention).
  - Add `portfolio/gblockparty.yaml` with the Phase-1 KPI set: total visitors, views per collection, top-5 gBlocks by views, SEO rank for target queries, YT→site referral.
- Visual + copy polish pass on the inactive `PaywallCard` component (tighten type, spacing, CTA copy; confirm it would render acceptably when activated).

**Acceptance Criteria:**
- [ ] Plausible script loads on every page; a test page view appears in the Plausible dashboard.
- [ ] GitHub Action runs on a nightly cron; a successful run commits `data/youtube-views.json` with at least 15 video entries and triggers a Vercel rebuild.
- [ ] gBlock pages optionally display the scraped view count when a matching video ID is present.
- [ ] `lexcorp-war-room/portfolio/boston-founder-radio.yaml` is no longer active; `portfolio/gblockparty.yaml` exists with the Phase-1 KPI set populated.
- [ ] `PaywallCard` forced-render fixture passes visual review (no broken copy, clear CTA).

**Manual Tasks:**
- Create Plausible site entry and copy the tracking snippet/domain _(blocks: Step 4.plausible)_ — Plausible dashboard signup, no CLI path.

**Parallelization:** implementation-safe

**Coordination Notes:** Three independent tracks with different repos/paths.
- Lane A — Plausible: `apps/web/src/app/layout.tsx` + an env var.
- Lane B — YT scraper: `.github/workflows/scrape-youtube.yml` + `scripts/scrape-youtube.mjs` + `data/youtube-views.json`.
- Lane C — lexcorp-war-room: cross-repo edits to the sibling repo's `portfolio/*.yaml` files (requires that repo to be cloned alongside; separate commit).
- Lane D — paywall polish: `apps/web/src/components/PaywallCard.tsx`.
No overlap. Lane C is a different repo so its commit is separate.

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

---

## Deferred / Future Work

- **Podcast / RSS distribution for Weekly SOTA** — revisit after 8 weeks of stable weekly cadence (spec §12).
- **Weekly G → lexcorp-war-room KPI injection at build time** — revisit when Weekly G becomes the dominant portfolio front-door (spec §7, §12).
- **Membership paywall activation** — gated on concrete thresholds (≥1k monthly reads on any gBlock, ≥5k monthly uniques on any collection) per spec §7.
- **YT Analytics retention telemetry** — requires YouTube Analytics API auth; Phase 2 per spec §9.
- **Tag pages (`/t/<tag>`)** — URL pattern reserved; not built in Phase 1.
- **Full-text search** — deferred; ~5 gBlocks at launch is below the threshold where search pays off.
- **Late Night with G** — paused, not migrated.
- **Boston Founder Radio** — dropped; revisit only if a real guest pipeline forms.
- **VibeCoding** — dropped as a collection; livestream material may surface as `stream`-type gBlocks linked from tutorials or vlogs.

## Cross-Phase Concerns

### Integration Tests
- **End-to-end build** exercising the schema, MDX pipeline, and routes together — added at the end of Phase 2 against the fixture gBlocks; re-run on every canary add in Phase 3.
- **Redirect test** for `/g/<slug>` — added in Phase 2 with fixture gBlocks; validated against the 5 canaries in Phase 3.

### Non-Functional Requirements
- **Performance** — Next.js static generation for all gBlock pages; Phase 2 acceptance includes `pnpm build` producing a clean production build. Lighthouse pass deferred to post-launch (early Phase 4).
- **Accessibility** — Phase 2 components should ship with semantic HTML (landmark roles, heading order, alt text on hero images). No formal audit in Phase 1; Phase 4 polish pass will review the paywall card for a11y at minimum.
- **SEO** — Phase 2 gBlock page must emit `<title>`, `<meta description>`, and Open Graph tags derived from frontmatter. Phase 4 adds analytics; keyword-rank monitoring is manual/external.
- **Security** — paywall scaffolded but not activated; no payment or auth attack surface in Phase 1. MDX body is authored content only (no user input), so XSS surface is minimal.
