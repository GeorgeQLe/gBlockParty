# Record Tasks — gBlockParty

> Condition-gated documentation records. Move to `tasks/todo.md` when the condition is met.

## Documentation Records

- [ ] `/burn-rate` - create `research/burn-rate.md`
  - Source: business-app pack, spec §7 monetization
  - Condition: project has real hosting/infra costs or revenue to track
  - Non-blocking reason: v1 is a static Vercel site with negligible cost; no revenue yet
  - Required data/access: hosting bills, domain costs, any paid tool subscriptions
  - Measurement/query: tally monthly spend vs. any revenue
  - Target/acceptance note: documented monthly burn with category breakdown
  - Revisit: 2026-07-01 or when monetization activates
  - Completion evidence: `research/burn-rate.md` exists with real numbers
  - Promotion rule: move to todo when paywall activates or infra costs exceed $50/mo

- [ ] `/runway-model` - create `research/runway-model.md`
  - Source: business-app pack
  - Condition: burn-rate documented and monetization strategy validated
  - Non-blocking reason: no revenue model active yet; project is pre-monetization
  - Required data/access: burn-rate data, monetization research, revenue projections
  - Measurement/query: model months-of-runway under different growth scenarios
  - Target/acceptance note: 3-scenario runway model (conservative, base, optimistic)
  - Revisit: 2026-08-01 or when burn-rate is documented
  - Completion evidence: `research/runway-model.md` exists
  - Promotion rule: move to todo when `/burn-rate` and `/monetization` are complete

- [ ] `/customer-feedback` - create `research/customer-feedback.md`
  - Source: business-app pack
  - Condition: at least 12 Weekly G episodes published with audience interaction data
  - Non-blocking reason: no audience feedback channels active yet; Weekly G hasn't started
  - Required data/access: YouTube comments, any DMs/emails, community interactions
  - Measurement/query: aggregate feedback themes and sentiment
  - Target/acceptance note: documented feedback themes with actionable patterns
  - Revisit: after 12 Weekly G episodes (est. 2026-08-01)
  - Completion evidence: `research/customer-feedback.md` exists with real data
  - Promotion rule: move to todo after 12 episodes published
