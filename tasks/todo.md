# gBlockParty — Post-v1 Cadence Plan

> Working document for the current phase. Full plan lives in `tasks/roadmap.md`.
> Spec: `specs/gblockparty-v1.md` · Interview: `specs/gblockparty-v1-interview.md`
> Updated: 2026-04-30

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
- [ ] `/research-roadmap` - scan documentation health and recommend next documentation or research work, now that all implementation phases are complete.

## Current Operating Plan

**Goal**: Prove sustained output. Weekly G is the only required publishing commitment for the next 3 months.

**Scope**:
- Publish one Weekly G episode per week on the existing George Le channel.
- Keep the public scoreboard to 3–4 honest signals: features shipped, waitlist/user interest, feedback/conversations, biggest lesson or decision.
- Use lightweight recording visuals for episodes 1–10. War Room tooling remains deferred.
- Treat Shorts as clips from Weekly G, not as a separate production commitment.
- Keep GCanBuild and Weekly SOTA as optional playlists/backlog until Weekly G cadence is proven.

> Test strategy: content/process checklist; no app-code work required unless the Weekly G MDX canary is authored.

---

## Follow-ups

- [ ] Step 3.4: Author Weekly G Ep 1 canary MDX — blocked on user recording video + providing YouTube video ID. Weekly G hidden from site until ready (see `HIDDEN_COLLECTIONS` in `apps/web/src/lib/hidden-collections.ts`).
- [ ] Mine `GeorgeQLe/boston-founder-radio-v1` (archived) for Stripe membership code — not needed until paywall activation (gated on audience thresholds per spec §7).
- [ ] Consider custom Weekly G War Room infrastructure only after 10 published episodes prove the format and the lightweight tooling becomes a bottleneck.

## All phases complete

All 4 phases shipped. Phase 4 archived to `tasks/phases/phase-4.md`. Project is at v1 feature-complete.
