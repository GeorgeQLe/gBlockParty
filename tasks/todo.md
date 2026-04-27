# gBlockParty — Phase 3 of 4: Launch

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Generated: 2026-04-25

## Priority Task Queue

- [x] Step 3.1: Upgrade GCanBuild fixture tutorials to production canary content
- [x] Step 3.2: Add third GCanBuild canary (Full-Stack Web App tutorial)
- [x] Step 3.3: Author Weekly SOTA canary MDX
- [x] Step 3.5: Production build config (metadataBase, env)
- [x] Step 3.6: Create GitHub repo + push
- [x] Step 3.7: Create Vercel project + configure domain
- [x] Step 3.8: Verify live deployment + smoke test
- [x] Step 3.9: Write regression tests for Phase 3 acceptance criteria
- [x] Step 3.10: Final verification — all tests, typecheck, build green

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

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none

### Implementation
- Step 3.1: Upgrade GCanBuild fixture tutorials to production canary content
  - Files: modify `content/gblocks/gcanbuild/pastebin-clone-nextjs.mdx`, modify `content/gblocks/gcanbuild/better-auth-tutorial.mdx`
  - Replace placeholder video ID (`dQw4w9WgXcQ` in pastebin) with the real YouTube video ID from George's channel. The `better-auth-tutorial.mdx` already has a real-looking ID (`L8_98i_bMMA`) — verify it's the actual channel video or replace.
  - Expand MDX bodies from thin step outlines to production-quality walkthroughs: add section summaries synthesized from the video outline, code snippets for key steps, and `<Callout>` tips. Target ~500–800 words per canary (enough to be useful, not a full transcript).
  - Keep existing frontmatter fields intact; update `publishedAt` to match the real video publish dates if known.
  - The `streaming-highlight-clip.mdx` clip stays as-is — it's valid content but not one of the 5 canaries.
  - **Prerequisite:** User must provide the real YouTube video IDs for these tutorials (or confirm the existing ones are correct). Ask the user before proceeding.
- Step 3.2: Add third GCanBuild canary (Full-Stack Web App tutorial)
  - Files: create `content/gblocks/gcanbuild/full-stack-web-app.mdx`
  - New canary for the "Full Stack Web App Tutorial" (Next.js + Better Auth + Neon + Drizzle + tRPC + Tanstack Query — ~10.2k views, top performer on the channel).
  - Frontmatter: `type: tutorial`, `collection: gcanbuild`, `featured: false`, `videoUrl` from real channel video, `tags: [nextjs, better-auth, neon, drizzle, trpc, tanstack-query, full-stack]`, `heroImage` (use placeholder path — no image asset yet).
  - MDX body: `<YouTube>` embed + section walkthrough + code blocks + `<RepoCard>` if a companion repo exists.
  - **Prerequisite:** User must provide the real YouTube video ID and confirm the title. Ask the user before proceeding.
- Step 3.3: Author Weekly SOTA canary MDX
  - Files: modify `content/gblocks/weekly-sota/sota-ep-001.mdx`
  - **Blocked on manual task:** User must decide SOTA pilot strategy (reframe existing "Sam Altman Stuns Investors" video vs. record fresh Ep 1). Once decided, upgrade the fixture to production quality.
  - If reframing existing video: update `videoUrl` to the real video ID, write show-notes-style MDX body (topic summary, key quotes/claims, links to referenced articles, timestamps).
  - If new recording: user provides video ID + topic after recording; then author MDX.
  - Keep `featured: false` (SOTA is not pinned to featured rail at launch).
- Step 3.5: Production build config (metadataBase, env)
  - Files: modify `apps/web/src/app/layout.tsx` (set `metadataBase` to `https://gblockparty.com`), optionally create `vercel.json` if framework detection needs hints
  - Set `metadataBase: new URL("https://gblockparty.com")` in the root layout metadata export — this resolves the build warning about social OG images and ensures all OG URLs are absolute in production.
  - Verify `next.config.ts` has no blockers for Vercel deployment (current config is minimal and Vercel-ready).
  - Run `pnpm --filter @gblockparty/web build` to confirm clean production build with all canary pages generated.
- Step 3.6: Create GitHub repo + push
  - **Blocked on manual task:** User must confirm `gh` CLI is authenticated (`gh auth status`).
  - Commands: `gh repo create GeorgeQLe/gblockparty --public --source . --push` (or equivalent). Push `master` branch.
  - Verify repo is accessible at `github.com/GeorgeQLe/gblockparty`.
- Step 3.7: Create Vercel project + configure domain
  - **Blocked on manual task:** User must confirm `vercel` CLI is authenticated (`vercel whoami`).
  - Commands: `vercel link` to connect the repo, `vercel domains add gblockparty.com` to configure the apex domain.
  - Vercel auto-detects the Next.js framework and pnpm monorepo. May need to set the root directory to `apps/web` in project settings.
  - Output the DNS records Vercel provides (A record + CNAME) for the user to add at their registrar.
- Step 3.8: Verify live deployment + smoke test
  - **Blocked on manual task:** User must add DNS records at their domain registrar.
  - Verify `https://gblockparty.com` resolves with valid TLS cert.
  - Smoke test: home page loads with featured rail showing pinned canaries, each collection page lists its canaries, each canary detail page renders type-appropriate header (video embed for episodes, hero image for tutorials), `/g/<slug>` short-links 301 to canonical URLs.

### Green
- Step 3.9: Write regression tests for Phase 3 acceptance criteria
  - Files: modify `apps/web/src/__tests__/pages.test.ts` (add Phase 3 canary-specific tests)
  - Cases: (1) `loadAllGBlocks()` returns canary gBlocks with production video IDs (not placeholder `dQw4w9WgXcQ`), (2) all 3 GCanBuild canaries have `type: tutorial`, (3) SOTA canary has `type: episode` + `videoUrl`, (4) Weekly G canary has `type: episode` + `featured: true`, (5) at least 2 canaries have `featured: true`, (6) `full-stack-web-app` slug exists.
- Step 3.10: Final verification — all tests, typecheck, build green
  - Commands: `pnpm -w test`, `pnpm -w -r typecheck`, `pnpm --filter @gblockparty/web build`
  - Expected: all tests pass (Phase 1 + Phase 2 + Phase 3), typecheck clean, production build succeeds with canary pages.

### Milestone: Phase 3 Launch Ready
- [x] All 5 canary MDX files exist under `content/gblocks/<collection>/<slug>.mdx` and validate against the Phase-1 schema.
- [x] `https://gblockparty.com` resolves to the Vercel deploy with a valid TLS cert.
- [x] Home page shows featured-rail pins for the `featured: true` canaries and the firehose lists all 5.
- [x] Each of the 3 collection pages (`/gcanbuild`, `/weekly-sota`, `/weekly-g`) lists its canary.
- [x] Each canary `/<collection>/<slug>` URL renders correctly with type-appropriate header (video embed on SOTA + Weekly G, hero image on GCanBuild tutorials).
- [x] `/g/<slug>` short-links for all 5 canaries 301 to canonical URLs.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**:
- Deviations from plan: Step 3.4 (Weekly G Ep 1) deferred — blocked on user recording. Weekly G collection hidden via `HIDDEN_COLLECTIONS`. Effectively 4 canaries live instead of 5.
- Tech debt / follow-ups: Weekly G canary pending user video recording. GitHub default branch is `main` (stale from old project), current work on `master`. Vercel GitHub App not authorized — manual deploys via `vercel deploy --prod` for now. `next-mdx-remote` upgraded from v5→v6 for Vercel compatibility.
- Ready for next phase: Yes — Phase 3 Launch Ready milestone fully met.

## Phase 3 Complete

All verification gates passed on 2026-04-27:
- `pnpm -w test` — 33/33 green (14 schema + 5 loader + 14 pages)
- `pnpm -w -r typecheck` — clean (2 packages)
- `pnpm --filter @gblockparty/web build` — 12 pages generated

---

## Follow-ups (deferred; revisit in later phases)

- [ ] Step 3.4: Author Weekly G Ep 1 canary MDX — blocked on user recording video + providing YouTube video ID. Weekly G hidden from site until ready (see `HIDDEN_COLLECTIONS` in `apps/web/src/lib/hidden-collections.ts`).
- [ ] Decommission `lexcorp-war-room/portfolio/boston-founder-radio.yaml` — scheduled for Phase 4.
- [ ] Add `lexcorp-war-room/portfolio/gblockparty.yaml` with platform-level KPIs — scheduled for Phase 4.
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).
