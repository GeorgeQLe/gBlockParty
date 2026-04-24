# gBlockParty v1 — Interview Log

**Date:** 2026-04-23 / 2026-04-24
**Driver:** `/spec-interview`
**Output:** `specs/gblockparty-v1.md`

## Context loaded before the interview

- `README.md` — project decisions already made + 7 open questions.
- `packages/gblock-schema/src/index.ts` — current flat Zod schema.
- No `.agents/project.json`, no `research/icp.md`. Project type not designated; proceeded without packs.
- Mid-interview: scraped `@GeorgeLe` YouTube channel for content mix + performance data (HTML scrape + RSS feed; yt-dlp unavailable).

## Turn-by-turn record

### Turn 1 — Visual system, Home IA, URL scheme
**Options presented:**
- Visual: Playful brutalist (rec) / Strict brutalist / Soft neo-brutalist.
- Home: Curated + firehose hybrid (rec) / Collection-first / Pure firehose.
- URLs: `/<collection>/<slug>` canonical (rec) / `/g/<slug>` canonical / slug-only.

**User choices:** all three recommendations accepted.

### Turn 2 — Content authoring, membership defaults, paywall UX
**Options presented:**
- Authoring: MDX + discriminated-union frontmatter (rec) / MDX flat optional / Markdown-only.
- Membership defaults: all-free + per-gBlock opt-in (rec); multi-select allowed.
- Paywall: Preview + paywall card (rec) / Hard paywall / Hidden.

**User choices:** MDX + discriminated union, all-free default, preview+paywall. Also asked me to analyze `@GeorgeLe` YouTube channel to inform content strategy.

### Turn 3 — YouTube channel research (failed → retried)
Initial WebFetch returned only YouTube chrome (JS-rendered grid). User instructed to find another way.
- `curl` + HTML extract → got `externalId=UCJMUR6Ne3gi6gAeaFpvrwHQ`.
- RSS feed at `youtube.com/feeds/videos.xml?channel_id=…` → titles + dates for last 15 videos.
- Full channel HTML re-parse → titles + view counts + relative publish dates for 28 videos.

**Top 4 by views (all long-form full-stack tutorials):** 10.2k / 5.5k / 4.5k / 4.2k.
**Three content pillars identified:** build tutorials (GCanBuild), livestream VODs ($1M Vibe Coding), AI commentary ("Late Night with G" + shorts).

### Turn 4 — Initial collections, schema additions, migration canaries
**Options presented:**
- Collections: BFR + GCanBuild + LateNight + VibeCoding (rec) / BFR + GCanBuild only / format-as-collection.
- Schema adds: `clip` type, `stream` type, `featured` flag, universal `videoUrl`.
- Canaries: 5 real canaries across 3 collections (rec) / full BFR migration / one-of-each placeholder.

**User choices:** all 4 collections, all 4 schema adds, 5 real canaries.

### Turn 5 — User challenged BFR's inclusion and asked for performance-based judgment
I pulled view counts per video (parsed from channel HTML). Findings:
- Tutorials dominate (top 4 = 24k+ combined views).
- Serialized "Mailchimp Clone" P1–P8 underperformed (183–983 each) vs. monolithic "Trello Clone" (4.5k).
- BFR-tagged commentary ("Sam Altman") = 791 views — but no interview content exists.
- Late Night Ep 1 = 24 views.
- VibeCoding livestream VODs = 24–37 views.
- Shorts = 17–58 views.

**Recommendation given:** Path 1 (audience growth via tutorials) with a cheap Path 2 experiment (text-first commentary). Path 3 (monetization) premature.

### Turn 6 — Strategic direction + time budget + BFR status
**User choices:**
- Goal: "I'm not sure — help me think through it."
- Time budget: **5–10 hrs/wk.**
- BFR: **Kill as a brand, fold into LateNight commentary.**

### Turn 7 — Revised direction proposal (GCanBuild + LateNight text-first)
**User pushed back:** revealed Weekly SOTA (a running weekly AI industry show, not previously mentioned) AND a planned Weekly G vlog (lexcorp portfolio top-of-funnel).

### Turn 8 — SOTA vs Late Night relationship + SOTA format + Collections v2
**User choices:**
- SOTA vs. Late Night: **running in parallel as distinct shows.**
- SOTA format: video on YouTube today, aspirationally multi-format (video + audio + text).
- Collections: gcanbuild + weekly-sota + Weekly G (new).

### Turn 9 — Time budget overrun flagged (11–19 hrs/wk > 10 hrs/wk ceiling)
Presented trade options: fold Late Night into SOTA (rec), accept 15+ hrs/wk, biweekly Weekly G, or kill Weekly G.

**User choice:** fold Late Night into SOTA, but **clarified Late Night is paused, not consolidated.** Ep 1 not migrated; no slug reserved.
**Weekly G ↔ lexcorp-war-room wiring:** none. Weekly G is pure editorial vlog content in Phase 1.

## Final decisions

Captured in `specs/gblockparty-v1.md`. Summary:

- **3 live collections:** `gcanbuild`, `weekly-sota`, `weekly-g`.
- **Paused / dropped:** Late Night with G (paused), BFR (dropped), VibeCoding-as-collection (dropped).
- **Visual system:** Playful brutalist tokens in `globals.css`.
- **URL canonical:** `/<collection>/<slug>`; `/g/<slug>` short-link 301.
- **Schema:** discriminated union on `type`; adds `clip`, `stream`; adds `heroImage`, `videoUrl`, `featured`, `seriesSlug`; per-type required fields.
- **Membership:** schema + UI built, zero gBlocks gated at launch. Activation threshold: any gBlock ≥1k monthly reads AND a collection ≥5k monthly unique readers.
- **Canaries (5):** 3 GCanBuild tutorials, 1 SOTA pilot, 1 Weekly G Ep 1.
- **Performance signal stack:** age-adjusted views per gBlock → median per collection → SEO keyword carry → engagement → (deferred) watch retention.
- **Lexcorp war-room:** decommission `portfolio/boston-founder-radio.yaml`; add `portfolio/gblockparty.yaml` with the Phase-1 KPI set.

## Deviations from the original README

| README decision | Interview outcome | Reason |
|---|---|---|
| BFR survives as a collection | **Dropped from Phase 1** | No guest pipeline; the one "BFR" video is commentary, not interview. Commentary absorbed by SOTA. |
| Single `membership` enum active from day 1 | Schema + UI built, **no gBlocks gated** at launch | Audience too small for monetization to pay back paywall infra cost. Turn-on thresholds set. |
| Flat `type` enum (tutorial/episode/essay/repo/tool/demo) | **Discriminated union + new types `clip` and `stream`** | Shorts and livestream VODs are distinct formats with different required fields. |
| Migration plan described but collection set not final | Collections reduced from implied (BFR + GCanBuild + …) to **`gcanbuild`, `weekly-sota`, `weekly-g`** | Time budget (5–10 hrs/wk); SOTA + Weekly G surfaced mid-interview as committed/planned shows. |
| `portfolio/gblockparty.yaml` roll-up (scope unspecified) | **Specific Phase-1 KPI set** chosen: total visitors, views per collection, top-gBlocks, SEO rank, YT-to-site referrals | Grounded in what the YouTube performance data says actually matters. |

## Aspirations captured but out of Phase 1 scope

- SOTA multi-format (audio feed + newsletter) — after 8 weeks of stable weekly cadence.
- Weekly G → lexcorp-war-room KPI injection — when Weekly G becomes the dominant portfolio front-door.
- Paid membership activation — per the thresholds above.
- YT Analytics retention telemetry — Phase 2.
- Search, tag pages — deferred until gBlock count justifies them.
