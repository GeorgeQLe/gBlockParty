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
- [x] Step 4.7: PaywallCard visual + copy polish
- [x] Step 4.8: Write regression tests for Phase 4 acceptance criteria
- [x] Step 4.9: Final verification — all tests, typecheck, build green

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
- Step 4.2: Build YouTube view-count scraper script
- Step 4.3: Create GitHub Action for nightly YT scrape
- Step 4.4: Surface view counts on gBlock detail pages
- Step 4.5: Decommission `boston-founder-radio.yaml` in lexcorp-war-room
- Step 4.6: Add `gblockparty.yaml` to lexcorp-war-room portfolio
- Step 4.7: PaywallCard visual + copy polish

### Green
- Step 4.8: Write regression tests for Phase 4 acceptance criteria
- Step 4.9: Final verification — all tests, typecheck, build green

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
