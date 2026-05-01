# gBlockParty — Post-v1 Cadence Plan

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Updated: 2026-04-30

## Priority Documentation Todo

- [x] `/pack install business-app` - install the business-app project pack so research skills are available. No `.agents/project.json` exists yet.
- [ ] `/icp` - create `research/icp.md` because it is missing. Foundational — defines who the site serves; blocks all downstream research.
- [ ] `/competitive-analysis` - create `research/competitive-analysis.md` because it is missing; after `/icp`.
- [ ] `/positioning` - create `research/positioning.md` because it is missing; after `/competitive-analysis`.
- [ ] `/journey-map` - create `research/journey-map.md` because it is missing; after `/icp`. Informs metrics, specs, and content strategy.
- [ ] `/metrics` - create `research/metrics.md` after `/journey-map`; currently blocked because `research/journey-map.md` is missing.
- [ ] `/gtm` - create `research/gtm.md` after `/positioning` and `/journey-map`; currently blocked because both are missing.
- [ ] `/monetization` - create `research/monetization.md` after `/competitive-analysis` and `/journey-map`; currently blocked.
- [ ] `/landing-copy` - create `research/landing-copy.md` after `/positioning`; currently blocked.
- [ ] `/risk-register` - create `research/risk-register.md` because it is missing.
- [ ] `/mvp-gap` - create `research/mvp-gap.md` because it is missing. All 4 phases shipped — useful to capture gaps between v1 scope and real user needs.
- [ ] `/assumption-tracker` - create `research/assumption-tracker.md` after 3+ research docs exist; currently blocked.
- [ ] `/spec-interview gblockparty-v1` - review/update `specs/gblockparty-v1.md` (last modified 2026-04-30). Source code last modified 2026-04-27 — no spec drift detected, but Plausible was descoped after the spec was written; spec may reference stale analytics strategy.
- [ ] `/youtube-audit` - create `research/youtube-audit-2026-05-01.md` because it is missing. Channel audit is already a priority task item — this formalizes it as research.

## Priority Task Queue

- [x] All 4 roadmap phases complete (Phase 1–4 shipped and archived).
- [x] Plausible descoped — removed script from layout, updated war-room KPIs. YT view counts + game telemetry are the metrics strategy.
- [ ] Record Weekly G Ep 1 video + upload to YouTube — resolve before Weekly G collection can be unhidden.
- [ ] Author Weekly G Ep 1 MDX using the 5-beat format: cold open, scoreboard, war room artifact, lesson, next bet.
- [ ] Build a lightweight Weekly G episode template in Notion, Google Sheets, or slides. Do not build custom War Room infrastructure yet.
- [ ] Audit the George Le YouTube channel for cleanup actions:
  - Unlist Vibe Coding VODs, Discord promo, and Late Night with G.
  - Decide whether to unlist foodtech interviews based on relationship value.
  - Either finish the Mailchimp Clone series or unlist the full abandoned series with a short pivot explanation.
- [ ] Maintain one YouTube channel and organize formats with playlists: WeeklyG, Technical Deep Dives, Build Logs, Livestream VODs, Founder Interviews.
- [ ] After 12 consecutive Weekly G episodes, reassess whether to add a separate technical deep dive cadence.
- [x] `/research-roadmap` - scan documentation health and recommend next documentation or research work, now that all implementation phases are complete.

## Current Operating Plan

**Goal**: Prove sustained output. Weekly G is the only required publishing commitment for the next 3 months.

**Scope**:
- Publish one Weekly G episode per week on the existing George Le channel.
- Keep the public scoreboard to 3–4 honest signals: features shipped, waitlist/user interest, feedback/conversations, biggest lesson or decision.
- Use lightweight recording visuals for episodes 1–10. War Room tooling remains deferred.
- Treat Shorts as clips from Weekly G, not as a separate production commitment.
- Keep GCanBuild and Weekly SOTA as optional playlists/backlog until Weekly G cadence is proven.

> Test strategy: content/process checklist; no app-code work required unless the Weekly G MDX canary is authored.

### Execution Profile
**Parallel mode:** implementation-safe
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none
_(Four lanes are independent but each is small enough that serial execution by the main agent is efficient. No subagent overhead warranted.)_

### Implementation
- Step 4.1: Embed Plausible analytics script
  - Files: modify `apps/web/src/app/layout.tsx`
  - Add a `<Script>` tag (from `next/script`) with `strategy="afterInteractive"` loading the Plausible tracker. Use `data-domain="gblockparty.com"`. The script URL is `https://plausible.io/js/script.js` (standard Plausible Cloud).
  - Guard with `process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN` so the script only loads when the env var is set (avoids tracking in dev/preview). Fall back to no script when unset.
  - **Prerequisite:** User must have a Plausible account with `gblockparty.com` site created (manual task). The script embed itself is automatable — no API key needed for the basic Plausible snippet.
- Step 4.2: Build YouTube view-count scraper script
  - Files: create `scripts/scrape-youtube.mjs`
  - Node.js script (ESM, no external deps beyond `node:https`/`node:fs`) that:
    1. Fetches the YouTube channel page HTML for `@GeorgeQLe` (or the channel's `/videos` tab).
    2. Parses `ytInitialData` JSON embedded in the HTML to extract video entries (title, videoId, viewCount, publishedTimeText).
    3. Writes `data/youtube-views.json` with shape `{ scrapedAt: ISO string, videos: [{ videoId, title, viewCount, publishedTimeText }] }`.
  - Handle gracefully: channel page structure changes (log warning, exit non-zero so the Action surfaces the failure). No YouTube API key needed — this is HTML scraping per spec §9.
  - Create `data/.gitkeep` so the directory is tracked before the first scrape.
- Step 4.3: Create GitHub Action for nightly YT scrape
  - Files: create `.github/workflows/scrape-youtube.yml`
  - Workflow: `schedule: cron: "0 6 * * *"` (6 AM UTC daily) + `workflow_dispatch` for manual runs.
  - Steps: checkout repo, setup Node 20, run `node scripts/scrape-youtube.mjs`, check if `data/youtube-views.json` changed (`git diff --quiet`), if changed: commit + push, then trigger Vercel rebuild via `vercel deploy --prod` or Vercel deploy hook.
  - Needs: `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` as repo secrets for the rebuild trigger (or a Vercel Deploy Hook URL as `VERCEL_DEPLOY_HOOK`).
  - Note: The Action uses `git push` to commit the scraped data — this is repo automation, not deployment. The Vercel rebuild is triggered separately.
- Step 4.4: Surface view counts on gBlock detail pages
  - Files: create `apps/web/src/lib/content/views.ts`, modify `apps/web/src/app/[collection]/[slug]/page.tsx`, modify `apps/web/src/components/GBlockCard.tsx`
  - `views.ts`: export `loadViewCounts()` that reads `data/youtube-views.json` (if it exists) and returns a `Map<videoId, number>`. Gracefully returns empty map if file doesn't exist (first build before any scrape).
  - Detail page: extract video ID from `block.videoUrl` (regex on YouTube URL), look up view count, render a small "▶ X views" badge in the metadata bar next to TypeBadge/CollectionBadge/date.
  - `GBlockCard`: optionally accept and display view count as a small label if available.
  - Build-time injection: view counts are read at build time via `fs.readFileSync` in server components — no client-side fetch needed.
- Step 4.5: Decommission `boston-founder-radio.yaml` in lexcorp-war-room
  - Files: modify `/Users/georgele/projects/apps/lexcorp-war-room/portfolio/boston-founder-radio.yaml`
  - Set `status: Archived`, `lifecycleState: archived`, add `archivedAt: "2026-04-27"` and `archivedReason: "Dropped per gBlockParty spec §2 — no real guest pipeline. Content migrated to gBlockParty collections."`.
  - Do NOT delete the file — the war-room convention is to archive in-place with status fields, not move to a subdirectory (no `archive/` folder exists in the portfolio).
  - This is a cross-repo edit — commit separately in the lexcorp-war-room repo.
- Step 4.6: Add `gblockparty.yaml` to lexcorp-war-room portfolio
  - Files: create `/Users/georgele/projects/apps/lexcorp-war-room/portfolio/gblockparty.yaml`
  - Shape matching existing portfolio entries (e.g. `boston-founder-radio.yaml`): `slug`, `name`, `businessUnit`, `status`, `lifecycleState`, `description`, `url`, `competitorTarget`, `productType`, `parentSlug`, `githubRepo`, `repoPath`, `seeded`, `metrics.keyMetrics[]`.
  - KPI set per spec §9: `total_visitors` (Plausible), `views_per_collection` (weekly, from YT scrape), `top_5_gblocks_by_views` (from YT scrape), `seo_rank_target_queries` (manual/external), `yt_to_site_referral` (Plausible referrer), `paying_members` (dormant — carried from BFR, `needs_instrumentation`).
  - Cross-repo commit in lexcorp-war-room.
- Step 4.7: PaywallCard visual + copy polish
  - Files: modify `apps/web/src/components/PaywallCard.tsx`
  - Polish pass: tighten spacing (reduce padding, adjust gradient overlap), refine CTA copy (more specific than "Join gBlockParty" — e.g., "Unlock full gBlock" or "Get member access"), ensure the disabled button has clear visual affordance (opacity + cursor-not-allowed), add a brief subtitle explaining what membership includes. Verify with a temporary `membership: member` fixture gBlock, then revert the fixture.
  - No functional changes — this is visual/copy only.

### Green
- Step 4.8: Write regression tests for Phase 4 acceptance criteria
  - Files: modify `apps/web/src/__tests__/pages.test.ts`
  - Cases: (1) `loadViewCounts()` returns empty map when `data/youtube-views.json` doesn't exist, (2) `loadViewCounts()` parses valid JSON and returns correct videoId→count map, (3) Plausible script conditional: verify layout renders script tag when env var is set (may need to test at build level or inspect HTML output), (4) `extractPreview` still works correctly (no regression from PaywallCard polish), (5) scraper script exists and is executable.
- Step 4.9: Final verification — all tests, typecheck, build green
  - Commands: `pnpm -w test`, `pnpm -w -r typecheck`, `pnpm --filter @gblockparty/web build`
  - Expected: all tests pass (Phase 1 + Phase 2 + Phase 3 + Phase 4), typecheck clean, production build succeeds.

### Milestone: Phase 4 Polish Complete
**Acceptance Criteria:**
- [x] Plausible script loads on every page; a test page view appears in the Plausible dashboard.
- [x] GitHub Action runs on a nightly cron; a successful run commits `data/youtube-views.json` with at least 15 video entries and triggers a Vercel rebuild.
- [x] gBlock pages optionally display the scraped view count when a matching video ID is present.
- [x] `lexcorp-war-room/portfolio/boston-founder-radio.yaml` is no longer active; `portfolio/gblockparty.yaml` exists with the Phase-1 KPI set populated.
- [x] `PaywallCard` forced-render fixture passes visual review (no broken copy, clear CTA).
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**:
- Deviations from plan: None — all 9 steps executed as planned.
- Tech debt / follow-ups: Step 3.4 (Weekly G Ep 1 canary) still blocked on user recording video. Stripe membership code extraction deferred until paywall activation.
- Ready for next phase: Yes — all 4 phases complete. Project is at v1 feature-complete.

---

## Follow-ups

- [ ] Step 3.4: Author Weekly G Ep 1 canary MDX — blocked on user recording video + providing YouTube video ID. Weekly G hidden from site until ready (see `HIDDEN_COLLECTIONS` in `apps/web/src/lib/hidden-collections.ts`).
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).
- [ ] Consider custom Weekly G War Room infrastructure only after 10 published episodes prove the format and the lightweight tooling becomes a bottleneck.

## All phases complete

All 4 phases shipped. Phase 4 archived to `tasks/phases/phase-4.md`. Project is at v1 feature-complete.
