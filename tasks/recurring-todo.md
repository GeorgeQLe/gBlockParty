# Recurring Tasks — gBlockParty

> Documentation jobs that recur on a cadence. Track last-run and next-due dates.

## Documentation Recurring Work

- [ ] `/cohort-review` - create `research/cohort-review-YYYY-MM-DD.md`
  - Cadence: monthly
  - Owner/agent: `/cohort-review`
  - Scope: gBlockParty audience and content performance
  - Trigger: 1st of each month, after at least 1 month of Weekly G publishing
  - Last run: never
  - Next due: 2026-06-01 (or after first month of Weekly G episodes)
  - Command/skill: `/cohort-review`
  - Evidence/output path: `research/cohort-review-YYYY-MM-DD.md`
  - Escalation conditions: becomes blocking if metrics show declining engagement 3 months running

- [ ] `/retro` - create `research/retro-YYYY-MM-DD.md`
  - Cadence: quarterly
  - Owner/agent: `/retro`
  - Scope: gBlockParty project health, content cadence, growth
  - Trigger: end of quarter, after at least 1 quarter of operation
  - Last run: never
  - Next due: 2026-07-01 (end of Q2 2026)
  - Command/skill: `/retro`
  - Evidence/output path: `research/retro-YYYY-MM-DD.md`
  - Escalation conditions: becomes blocking if project direction needs major pivot

- [ ] `/youtube-audit` - create `research/youtube-audit-YYYY-MM-DD.md`
  - Cadence: quarterly
  - Owner/agent: `/youtube-audit`
  - Scope: George Le YouTube channel performance, content strategy alignment
  - Trigger: quarterly or after major channel strategy change
  - Last run: never
  - Next due: 2026-05-01 (immediate — first audit)
  - Command/skill: `/youtube-audit`
  - Evidence/output path: `research/youtube-audit-YYYY-MM-DD.md`
  - Escalation conditions: becomes blocking if channel metrics diverge from gBlockParty content strategy

- [ ] `/reconcile-dev-docs fix all` - reconcile development docs
  - Cadence: after each major phase or quarterly
  - Owner/agent: `/reconcile-dev-docs`
  - Scope: tasks/, specs/, phase archives
  - Trigger: after shipping a phase or quarterly check
  - Last run: never
  - Next due: 2026-07-01
  - Command/skill: `/reconcile-dev-docs fix all`
  - Evidence/output path: reconciled `tasks/`, `specs/`, and phase archives
  - Escalation conditions: becomes blocking if task docs diverge significantly from implementation state
