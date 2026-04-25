# gBlockParty — Phase 2 of 4: UI Surface

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-24

## Priority Task Queue

- [x] Step 2.1: Seed development fixture gBlocks
- [x] Step 2.2: Shared UI primitives (GBlockCard, TypeBadge, CollectionBadge)
- [ ] Step 2.3: Home page components (FeaturedRail, FirehoseFeed, ShortsRail)
- [ ] Step 2.4: Home page route
- [ ] Step 2.5: Collection page route
- [ ] Step 2.6: gBlock detail page route with MDX rendering
- [ ] Step 2.7: Redirect `/g/<slug>` + stub `/t/<tag>`
- [ ] Step 2.8: PaywallCard component
- [ ] Step 2.9: Build-time slug uniqueness + SEO metadata polish
- [ ] Step 2.10: Write regression tests
- [ ] Step 2.11: Run all tests, typecheck, build — verify green; refactor

## Phase 2: UI Surface

**Goal**: Render the site. Ship every page type the spec calls for, with the inactive paywall scaffold in place, so that Phase 3 only has to add content and deploy.

**Scope**:
- App Router routes: `/`, `/<collection>`, `/<collection>/<slug>`, `/g/<slug>` (301), `/t/<tag>` (stub).
- Components: GBlockCard, FeaturedRail, FirehoseFeed, ShortsRail, TypeBadge, CollectionBadge, PaywallCard.
- Global slug-uniqueness check at build time.
- SEO metadata on all pages.

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

## Next step: Phase 2, Step 2.3 — Home Page Components (FeaturedRail, FirehoseFeed, ShortsRail)

### Context

Step 2.2 is complete — 3 shared UI primitives (`TypeBadge`, `CollectionBadge`, `GBlockCard`) implemented as server components under `apps/web/src/components/`. All use Tailwind utilities against the Step 1.5 design tokens. `GBlockCard` composes both badges, links to `/<collection>/<slug>`, shows hero image or type-colored placeholder, formatted date, and CSS-only brutal hover effect. Tests 19/19 green, typecheck clean, build green.

### Ship status going in

- **Shipped last session:** Step 2.2 — TypeBadge, CollectionBadge, GBlockCard components.
- **Test status:** `pnpm -w test` 19/19 green. `pnpm -w -r typecheck` clean. `pnpm --filter @gblockparty/web build` green (4 static pages).
- **No git remote:** local `master` only; `git push` is a local no-op.
- **Deploy:** none.

### What this step does

Creates 3 home-page section components that compose the Step 2.2 primitives. These are the building blocks for the home page route (Step 2.4).

### Files to create

- **`apps/web/src/components/FeaturedRail.tsx`** — Horizontal row of 1–3 `GBlockCard`s for featured gBlocks.
- **`apps/web/src/components/FirehoseFeed.tsx`** — Reverse-chron list of all gBlocks with filter chips.
- **`apps/web/src/components/ShortsRail.tsx`** — Horizontal scroll of clip-type gBlocks.

### Component specs

**FeaturedRail**
- Props: `blocks: GBlock[]` (pre-filtered by caller, or filters internally by `featured: true`).
- Filters `featured: true`, sorts by `publishedAt` desc, takes first 3.
- Renders a horizontal row of `GBlockCard`s (grid or flex, 1–3 cards).
- Graceful empty state: renders nothing (or a subtle placeholder) when no featured blocks exist.
- Needs `collectionName` for each block — either accept a map prop or derive from the block's `collection` field.

**FirehoseFeed**
- Props: `blocks: GBlock[]` (all gBlocks).
- Sorts by `publishedAt` desc (reverse-chron).
- Renders a vertical list/grid of `GBlockCard`s.
- Type and collection filter chips — since this is a server component, filter chips can use URL search params or be purely visual labels for now (client interactivity deferred to later if needed; CSS-only or link-based filtering preferred).
- Graceful empty state.

**ShortsRail**
- Props: `blocks: GBlock[]` (pre-filtered or filters internally to `type === "clip"`).
- Filters to clip-type only.
- Horizontal scrollable row of `GBlockCard`s (CSS `overflow-x-auto`).
- Hidden entirely when no clips exist (return `null`).

### Approach & key decisions

- **Server components only.** No `"use client"`. Filter chips in FirehoseFeed should be link-based (`<a href="/?type=tutorial">`) or purely decorative labels — no client-side state. If truly interactive filtering is needed, it can be added later with a client wrapper.
- **Import types from `@gblockparty/gblock-schema`.** Use `GBlock` type for props.
- **Compose `GBlockCard`** from Step 2.2. Pass `collectionName` — for now, use the raw `collection` slug as display name (the home page route in Step 2.4 can look up proper names from collection YAML).
- **No tests this step.** Tests-after strategy — regression tests come in Step 2.10.
- **Design tokens.** Continue using Tailwind utilities against `@theme` tokens. Section headings use `font-display`, `text-xl`/`text-2xl`, `font-bold`.

### Patterns established in Step 2.2

- `GBlockCard` accepts `{ block: GBlock; collectionName?: string }` — pass the block directly.
- `TypeBadge` and `CollectionBadge` are composed inside `GBlockCard` — no need to use them separately in these components.
- Color mapping for type-colored placeholders is inside `GBlockCard` — these rail/feed components don't need to duplicate it.
- Hover effect is handled by `GBlockCard` — no additional hover logic needed.

### Acceptance criteria for Step 2.3

- [ ] All 3 component files exist and export named components.
- [ ] `FeaturedRail` filters by `featured: true`, sorts by `publishedAt` desc, limits to 3, renders `GBlockCard`s.
- [ ] `FirehoseFeed` renders all blocks reverse-chron with `GBlockCard`s. Has filter chip UI (even if non-interactive).
- [ ] `ShortsRail` filters to clips only, renders horizontal scroll, returns `null` when empty.
- [ ] `pnpm -w test` still 19/19 green.
- [ ] `pnpm -w -r typecheck` clean.
- [ ] `pnpm --filter @gblockparty/web build` still succeeds.

### Execution Profile
**Parallel mode:** implementation-safe
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, UX

### Ship-one-step handoff contract (Step 2.3 → 2.4)

After approval, the clear-context implementation session must:

1. Implement **only Step 2.3**. Do not continue into 2.4.
2. Verify typecheck and build pass.
3. Mark Step 2.3 done in `tasks/todo.md`.
4. Append a record to `tasks/history.md`.
5. Commit and push (push is a local no-op).
6. Write Step 2.4's plan (Home page route) into `tasks/todo.md`.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Enter plan mode for Step 2.4 approval (`EnterPlanMode` → brief pass-through plan → `ExitPlanMode`). Stop before implementing.

---

## Follow-ups (deferred; revisit in later phases)

- [ ] Decommission `lexcorp-war-room/portfolio/boston-founder-radio.yaml` — scheduled for Phase 4.
- [ ] Add `lexcorp-war-room/portfolio/gblockparty.yaml` with platform-level KPIs — scheduled for Phase 4.
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).
- [ ] Create GitHub repo `GeorgeQLe/gblockparty` — scheduled for Phase 3 (Launch).
- [ ] Create Vercel project, link `gblockparty.com` — scheduled for Phase 3 (Launch).
