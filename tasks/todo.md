# gBlockParty — Phase 4 of 4: Polish

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-27

## Priority Task Queue

- [x] Step 4.1: Embed Plausible analytics script
- [x] Step 4.2: Build YouTube view-count scraper script
- [x] Step 4.3: Create GitHub Action for nightly YT scrape
- [x] Step 4.4: Surface view counts on gBlock detail pages
- [x] Step 4.5: Decommission `boston-founder-radio.yaml` in lexcorp-war-room
- [x] Step 4.6: Add `gblockparty.yaml` to lexcorp-war-room portfolio
- [ ] Step 4.7: PaywallCard visual + copy polish
- [ ] Step 4.8: Write regression tests for Phase 4 acceptance criteria
- [ ] Step 4.9: Final verification — all tests, typecheck, build green

## Phase 4: Polish

**Goal**: Post-launch instrumentation, performance-signal plumbing, and the cross-repo portfolio rollup. These aren't launch-critical but close out the Phase-1 scope from the spec.

**Scope**:
- Embed Plausible analytics in `apps/web/src/app/layout.tsx`.
- Build the nightly YouTube view-count scraper as a GitHub Action: scrape channel HTML via the same technique used during `/spec-interview`, commit `data/youtube-views.json` snapshot, trigger Vercel rebuild so gBlock pages can surface fresh view counts.
- Cross-repo edits to `lexcorp-war-room`:
  - Decommission `portfolio/boston-founder-radio.yaml` (move to `portfolio/archive/` or delete per that repo's convention).
  - Add `portfolio/gblockparty.yaml` with the Phase-1 KPI set: total visitors, views per collection, top-5 gBlocks by views, SEO rank for target queries, YT→site referral.
- Visual + copy polish pass on the inactive `PaywallCard` component (tighten type, spacing, CTA copy; confirm it would render acceptably when activated).

> Test strategy: tests-after

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
- [ ] Plausible script loads on every page; a test page view appears in the Plausible dashboard.
- [ ] GitHub Action runs on a nightly cron; a successful run commits `data/youtube-views.json` with at least 15 video entries and triggers a Vercel rebuild.
- [ ] gBlock pages optionally display the scraped view count when a matching video ID is present.
- [ ] `lexcorp-war-room/portfolio/boston-founder-radio.yaml` is no longer active; `portfolio/gblockparty.yaml` exists with the Phase-1 KPI set populated.
- [ ] `PaywallCard` forced-render fixture passes visual review (no broken copy, clear CTA).
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

---

## Follow-ups (carried from Phase 3)

- [ ] Step 3.4: Author Weekly G Ep 1 canary MDX — blocked on user recording video + providing YouTube video ID. Weekly G hidden from site until ready (see `HIDDEN_COLLECTIONS` in `apps/web/src/lib/hidden-collections.ts`).
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).

## Next step: Phase 4, Step 4.7 — PaywallCard visual + copy polish

### Context

The `PaywallCard` component (Step 2.8) is a functional scaffold — it renders a blurred preview with a membership CTA, but the visual polish and copy need refinement before Phase 4 close-out. This is visual/copy only, no functional changes.

### What this step does

1. Polish `PaywallCard.tsx`:
   - Tighten spacing: reduce outer padding, adjust gradient overlap so the fade is less abrupt.
   - Refine CTA copy: change heading from "Become a member to read this gBlock" to something more specific (e.g., "Unlock the full gBlock"). Change button text from "Join gBlockParty" to "Get member access" or similar.
   - Ensure the disabled button has clear visual affordance: add `opacity-60` + `cursor-not-allowed` classes.
   - Add a brief subtitle under the CTA heading explaining what membership includes (e.g., "Full tutorials, source code, and exclusive episodes").
2. Verify with a temporary `membership: member` fixture gBlock — visually confirm the card renders acceptably, then revert the fixture.
3. No functional changes — paywall logic, `extractPreview`, and routing are unchanged.

### Files to modify

- `apps/web/src/components/PaywallCard.tsx`
- Temporarily modify one fixture MDX for visual verification (revert after)

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, visual

### Acceptance criteria for Step 4.7

- [ ] PaywallCard has tighter spacing and smoother gradient fade.
- [ ] CTA copy is more specific than generic "Join gBlockParty".
- [ ] Disabled button has `opacity` + `cursor-not-allowed` visual affordance.
- [ ] Subtitle text present under CTA heading.
- [ ] Temporary fixture reverted — no member gBlocks in committed content.
- [ ] `pnpm -w test` green, `pnpm -w -r typecheck` clean, `pnpm --filter @gblockparty/web build` green.

### Ship-one-step handoff contract

After approval, implement only Step 4.7. Mark Step 4.7 done in `tasks/todo.md`. Update `tasks/history.md`. Commit and push. Write Step 4.8 plan. Enter plan mode for Step 4.8 approval.
