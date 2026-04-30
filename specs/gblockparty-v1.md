# gBlockParty v1 — Design & Phase-1 Specification

**Status:** Draft from `/spec-interview` on 2026-04-24
**Supersedes open questions in:** `README.md` §"Open questions for /spec-interview"
**Scope:** Phase-1 launch of gblockparty.com — visual system, IA, schema, content strategy, and migration canaries.

---

## 1. Goals & Strategic Posture

gBlockParty is the canonical home for George's content and code. Every artifact is a **gBlock**. Collections are editorial umbrellas grouping gBlocks.

### Primary goal (next 3 months)
**Prove a sustainable Weekly G publishing cadence on the existing George Le YouTube channel.** Not multi-channel expansion, not monetization, and not a custom War Room product before the show format has earned it.

### Time budget reality check
- Available: 5–10 hrs/wk (user stated).
- Working ceiling: **one Weekly G episode per week**. Technical deep dives and additional formats stay optional until the weekly cadence holds for at least 3 months.

### What is NOT in scope for Phase 1
- Membership paywall **activation** (schema + UI shipped, zero gBlocks gated at launch).
- Boston Founder Radio as an active collection (no guest pipeline; dropped).
- Late Night with G (paused; Ep 1 not migrated).
- VibeCoding as a standalone collection (livestream VODs underperform; raw streams are source material, not first-class content).
- A multi-channel YouTube split. The existing George Le channel remains the hub; playlists carry format separation until the audience is large enough to justify separate channels.
- Custom War Room infrastructure for recording visuals. Use lightweight Notion, Sheets, GitHub, Linear, or slides for the first 10 Weekly G episodes.
- Cross-repo wiring to `lexcorp-war-room` portfolio KPIs (deferred).
- YT Analytics retention telemetry (deferred to Phase 2).
- Podcast RSS / Apple Podcasts distribution (deferred).

---

## 2. Content Strategy

One live publishing commitment, with supporting collections retained as playlists/backlog rather than weekly obligations.

| Collection | Cadence | Format | Role | Budget |
|---|---|---|---|---|
| `weekly-g` | 1 / week | 5-beat vlog: cold open, scoreboard, war room artifact, lesson, next bet | Flagship. Proves the radical-transparency build-in-public brand. | 5–10 hrs/wk |
| `gcanbuild` | Optional / opportunistic | Monolithic long-form video + MDX walkthrough | SEO library and occasional deep dive. Add only after Weekly G cadence is stable. | no standing weekly commitment |
| `weekly-sota` | Paused / optional | Video primary; aspirational multi-format later | Backlog/commentary source. Not a second weekly show during the cadence test. | no standing weekly commitment |

### Collection descriptions

- **Weekly G** — Weekly vlog tracking LexCorp progress with radical transparency. The first 3 months are a cadence test: one episode per week, no skipped weeks, using lightweight visuals rather than custom tooling.
- **GCanBuild** — Full-stack build tutorials with named, SEO-loaded stacks (Next.js, Better Auth, Neon, Drizzle, tRPC, Tanstack Query, Shadcn). Keep as an SEO playlist/backlog, but do not make it a standing monthly obligation until Weekly G is proven. Serialized builds are discouraged after the Mailchimp Clone underperformance and abandonment risk.
- **Weekly SOTA** — Fast-moving AI industry commentary source. Paused as a standalone weekly show; may be absorbed into Weekly G lessons or occasional videos.

### Paused / dropped
- **Late Night with G** — Paused. Ep 1 (24 views) treated as a pilot; its content may be re-segmented into SOTA. No collection slug reserved at launch.
- **Boston Founder Radio (BFR)** — Dropped as a Phase-1 collection. No guest pipeline exists and the single commentary-tagged video ("OpenAI CEO Sam Altman…", 791 views) fits better under SOTA. `portfolio/boston-founder-radio.yaml` in `lexcorp-war-room` will be decommissioned per the README plan.
- **VibeCoding** — Dropped as a collection. The livestream VODs (24–37 views each) aren't first-class standalone content. Livestream material may still feed `stream`-type gBlocks linked from a GCanBuild tutorial or a Weekly G vlog.
- **Mailchimp Clone series** — Must not sit as an abandoned public build series. Either finish it intentionally, or unlist the series and publish a short pivot note/video.
- **Foodtech interviews** — Unlist unless maintaining the public relationship is strategically important.

---

## 3. Information Architecture

### Home page (`/`)
**Curated + firehose hybrid.**
- **Featured rail** — 1–3 manually pinned gBlocks (driven by `featured: true` frontmatter).
- **All gBlocks feed** — reverse-chronological list of every gBlock, with type and collection filters.
- **Shorts rail** — horizontal row of recent `clip`-type gBlocks (when any exist).

### URL scheme
Canonical URLs embed the collection; `/g/<slug>` is a short-link redirect.

```
canonical:   /<collection>/<slug>      e.g. /gcanbuild/pastebin-clone-nextjs
shortlink:   /g/<slug>                 → 301 to canonical
list page:   /<collection>             e.g. /gcanbuild
home feed:   /                         featured + firehose
tag page:    /t/<tag>                  (Phase 2; reserve pattern)
```

Slug uniqueness enforced **globally**, not per-collection, so `/g/<slug>` is always an unambiguous redirect.

### Collection page (`/<collection>`)
- Collection hero (name, description, optional front-door URL).
- gBlock grid (type + date filters; reverse-chronological default).
- Series grouping when multiple gBlocks share a `seriesSlug`.

### gBlock page (`/<collection>/<slug>`)
- Type-specific header block:
  - `tutorial` / `essay` — hero image + title + reading time.
  - `episode` / `stream` / `clip` — embedded video player (YouTube iframe), then transcript/show-notes MDX.
  - `repo` / `tool` / `demo` — card with repo/demo URL, description, MDX body for context.
- MDX body.
- Member paywall card (only rendered when `membership: member` + viewer is not a member). At launch, no gBlocks have `membership: member`, so the paywall renders nowhere in Phase 1. Code path still built.

---

## 4. Visual System — "Playful Brutalist"

Duolingo-adjacent warmth with hard edges. Written as CSS custom properties for `apps/web/src/app/globals.css`, consumed by Tailwind v4.

### Color tokens
```css
--color-bg: #FFF8E7;          /* cream */
--color-ink: #0B0B0B;         /* near-black borders, text */
--color-accent-lime: #C3F53C; /* primary accent — CTAs, featured tags */
--color-accent-coral: #FF6B5B;/* secondary accent — type badges, highlights */
--color-accent-blue: #4D7CFE; /* tertiary — links, interactive */
--color-muted: #EDE4C9;       /* card hover, paywall card bg */
--color-ink-soft: #2A2A2A;    /* body text when on accent fills */
```

### Border + shadow system
- **Border:** `2.5px solid var(--color-ink)` on all cards, buttons, inputs.
- **Hard shadow:** `4px 4px 0 0 var(--color-ink)` offset, no blur.
- **Hover:** translate by `-1px, -1px` and bump shadow to `6px 6px`; no easing bounce.

### Radius scale
```
--radius-sm: 6px   /* tags, chips */
--radius-md: 12px  /* cards, buttons */
--radius-lg: 20px  /* hero containers, featured blocks */
```

### Typography
- **Display / heading:** Inter Variable (wght 700–900). Fallback: Nunito, system-ui.
- **Body:** Inter Variable (wght 400–600).
- **Mono:** JetBrains Mono Variable.
- **Scale (px):** 12 / 14 / 16 / 20 / 24 / 32 / 48 / 72.

### Motion
- Transitions ≤120ms.
- No elastic or spring easing; `ease-out` for entrances, `ease-in` for exits.
- No parallax, no scroll-triggered effects in Phase 1.

---

## 5. Data Model

### `gBlockSchema` (extended from `packages/gblock-schema/src/index.ts`)

Converts the flat schema into a **discriminated union on `type`** so type-specific required fields can be enforced.

**Shared fields (all types):**
- `slug: string` (unique globally)
- `type: "tutorial" | "essay" | "episode" | "stream" | "clip" | "repo" | "tool" | "demo"`
- `collection: string` (must match an existing `collections/<slug>.yaml`)
- `title: string`
- `summary?: string`
- `publishedAt?: datetime | null`
- `canonicalUrl?: url`
- `crossPosts?: url[]`
- `tags?: string[]`
- `membership: "free" | "member"` (default `free`)
- `heroImage?: string` (site-relative path)
- `videoUrl?: url` (universal optional — any type can have a companion video)
- `featured?: boolean` (for home-page pinning)
- `seriesSlug?: string` (groups gBlocks into a series)

**Type-specific required fields:**
- `tutorial`, `essay` — optional `readingTimeMinutes?: number`.
- `episode` — **required** `videoUrl` OR `audioUrl` (at least one); optional `durationSec?: number`, `guests?: string[]`.
- `stream` — **required** `videoUrl`, `startedAt: datetime`.
- `clip` — **required** `videoUrl`; optional `parentSlug?: string` (links to the long-form gBlock it was cut from).
- `repo` — **required** `repoUrl: url`.
- `tool`, `demo` — **required** `demoUrl: url`.

Validation via Zod `z.discriminatedUnion("type", […])`. The existing flat schema remains valid for the `tutorial` / `essay` cases that previously had no extras.

### `collectionSchema` (unchanged from current)
```
slug, name, description?, frontDoorUrl?
```
Phase 1 collection YAMLs to seed: `gcanbuild`, `weekly-sota`, `weekly-g`.

---

## 6. Content Authoring

- MDX per gBlock, one file per artifact, at `content/gblocks/<collection>/<slug>.mdx`.
- Frontmatter (YAML) validated against the discriminated-union schema at build time.
- MDX components available in body:
  - `<YouTube id="…" />` — embed (used heavily for SOTA episodes and GCanBuild tutorials).
  - `<RepoCard url="…" />` — for inline repo references.
  - `<Callout variant="note|warn|paid" />`.
  - `<AudioPlayer src="…" />` — reserved for future podcast audio; unused at launch.
- Collection YAMLs at `content/collections/<slug>.yaml`.

Example — a GCanBuild tutorial frontmatter:
```yaml
---
slug: pastebin-clone-nextjs-drizzle-neon-trpc
type: tutorial
collection: gcanbuild
title: "Build a Full Stack Pastebin Clone using Next.js, Shadcn, Drizzle, Neon, tRPC, Tanstack Query, Vercel"
publishedAt: 2026-03-19T10:00:00Z
heroImage: /media/gcanbuild/pastebin-hero.jpg
videoUrl: https://www.youtube.com/watch?v=NzfKEbgvA0A
tags: [nextjs, drizzle, neon, trpc, tanstack-query]
readingTimeMinutes: 12
featured: true
---
```

---

## 7. Membership Model

- **Schema:** ready (`membership: "free" | "member"`).
- **UI:** paywall card component built and rendered for `member` gBlocks to non-members. Preview mode — first ~150 words of body plus title/hero are public; paywall CTA below.
- **Policy at launch:** all gBlocks default `free`. **Zero** gBlocks gated. No Stripe plumbing migrated from BFR v1 yet.
- **Turn-on criteria:** Begin gating when any individual gBlock sustains **≥1,000 monthly reads**, AND at least one collection sustains **≥5,000 monthly unique readers**. Until then, paid membership is premature (expected conversion math: ~500–2k subs × 1–5% × $5–10 = $50–500/mo — not worth the infra cost).
- Membership remains **platform-level**, never per-collection.

---

## 8. Phase-1 Migration Canaries

Seed the site with real content that exercises every shipped collection and at least three distinct types.

### GCanBuild (3 canaries — flagship weight)
1. **Full Stack Web App Tutorial w/ Next.js, Better Auth, Neon DB, Drizzle ORM, tRPC, Tanstack Query** — top performer (~10.2k views). Video + MDX walkthrough.
2. **Better-Auth Beginner-Friendly Step by Step Tutorial** — second-top (~5.5k). Video + MDX.
3. **Build a Full Stack Pastebin Clone…** — most recent flagship tutorial (~1.2k, still climbing). Video + MDX. `featured: true`.

### Weekly SOTA (1 canary)
1. **SOTA pilot episode** — either (a) new Ep 1 recorded for launch, or (b) the existing "OpenAI CEO Sam Altman Stuns Investors…" (791 views) reframed as the SOTA pilot with updated show notes. Video + MDX.

### Weekly G (1 canary)
1. **Weekly G Ep 1** — inaugural vlog introducing the lexcorp portfolio thesis. New recording; vlog format. `featured: true`.

No BFR, Late Night, or VibeCoding content migrates in Phase 1.

---

## 9. Performance Signals & KPIs

### Phase-1 instrumentation (shipped at launch)
- Plausible (or similar privacy-first analytics) on gblockparty.com — page views, unique visitors, referrer, top gBlocks.
- YouTube view counts surfaced per-gBlock at build time (scraped nightly from channel HTML, cached in a JSON snapshot committed to repo — same technique this interview used).
- `portfolio/gblockparty.yaml` (in `lexcorp-war-room`) rolls up weekly: total visitors, top 5 gBlocks by views, views-per-collection.

### Weekly G scoreboard
Keep the public episode scoreboard to 3–4 honest signals:
- Features shipped.
- Waitlist/user interest.
- User conversations or feedback.
- Biggest lesson or decision.

Do not pad the episode with ten-line KPI dashboards. If a metric did not move, say why in the narrative and omit it from the scoreboard.

### Ranking of performance signals (from most to least reliable)
1. **Total views per gBlock, age-adjusted.** Primary KPI.
2. **Median views per collection.** Tells which umbrella is paying attention rent.
3. **SEO keyword carry.** Titles stacking concrete tech names (Next.js + Drizzle + Neon + tRPC) drove the top 4 videos. Mirror in page `<title>`, H1, MDX headings.
4. **Engagement (likes/comments).** Secondary — correlates with depth, skewed by audience size.
5. **Watch-time retention.** Best quality signal; requires YT Analytics API. Phase 2.

### KPI carryover from `boston-founder-radio.yaml` → `gblockparty.yaml`
- **Keep** — paying members (dormant until paywall turns on), weekly listens (rename → weekly views across collections).
- **Rethink** — MRR (single platform-level line, not per-collection).
- **Add** — views-per-collection (weekly), tutorial SEO rank for top 5 target queries, YT-to-gBlockParty referral conversion.
- **Retire** — anything BFR-specific (episode downloads from a dedicated feed, guest pipeline metrics).

---

## 10. Build & Deploy

- Stack (unchanged): pnpm workspaces + Turborepo, Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript strict, Zod.
- Deploy: Vercel, auto-deploy from `main`.
- Custom domain: `gblockparty.com` pointed at the Vercel project.
- Nightly job (Phase 1): GitHub Action scrapes YT channel HTML → commits `data/youtube-views.json` snapshot → triggers Vercel rebuild so view counts stay fresh.

---

## 11. Phase-1 Implementation Checklist

1. **Schema migration** — convert `gBlockSchema` to discriminated union; add `clip`, `stream` types; add shared fields (`heroImage`, `videoUrl`, `featured`, `seriesSlug`); add per-type required fields.
2. **Design tokens** — write `apps/web/src/app/globals.css` with the playful-brutalist token set.
3. **MDX pipeline** — wire MDX loader, frontmatter validation against schema, MDX components.
4. **Routing** — App Router: `/`, `/<collection>`, `/<collection>/<slug>`, `/g/<slug>` (301), `/t/<tag>` (stub).
5. **Home page** — featured rail + firehose feed + shorts rail + filter chips.
6. **Collection YAMLs** — seed `gcanbuild`, `weekly-sota`, `weekly-g`.
7. **Canary gBlocks** — author 5 MDX files per §8.
8. **Paywall card** — component + rendering logic (not activated, but wired).
9. **YT view scraper** — nightly Action + JSON snapshot + build-time injection.
10. **Analytics** — Plausible embed.
11. **Vercel project + domain** — create, point DNS.
12. **Lexcorp war-room update** — decommission `portfolio/boston-founder-radio.yaml`, add `portfolio/gblockparty.yaml` with the Phase-1 KPI set.

---

## 12. Open / Deferred Questions

- **SOTA audio distribution.** Aspirational multi-format; RSS feed + podcast distribution deferred. Revisit once weekly cadence is stable for ≥8 weeks.
- **Weekly G → lexcorp-war-room KPI injection / custom War Room app.** Ruled out until at least 10 Weekly G episodes prove the format and the lightweight tooling becomes a real bottleneck.
- **Membership activation.** Gated on the thresholds in §7.
- **Tag page (`/t/<tag>`).** Reserved URL pattern; not built in Phase 1.
- **Search.** Deferred; at ~5 gBlocks there's nothing to search.
