# ICP Search Log — gBlockParty

> Generated 2026-05-02 alongside `research/icp.md`.
> Scope confirmed by user: viewer/reader audience for gBlockParty as a B2C creator product.

## Phase 1 — Broad Market Research (8 queries)

### 1. `build in public developer audience YouTube viewers 2026`
**Why**: validate that build-in-public is a real, sized YouTube audience.
**Findings**: YouTube ~2.85B MAU. 79% of Gen Z viewers say YouTube creators form communities of belonging. Avg retention 30–60%. No direct "build in public viewer" sizing — confirmed it's a niche under the broader creator umbrella.
**Source**: globalmediainsight.com, fourthwall.com, talks.co.

### 2. `developer education YouTube channels Next.js tutorials audience demographics`
**Why**: size and benchmark the GCanBuild (tutorial) lane.
**Findings**: CodeWithHarry 5.6M subs, Web Dev Simplified 1.5M, Net Ninja 1.35M, Programming with Mosh 3.78M, freeCodeCamp 9.1M. Vercel runs its own channel. Specific audience demographics not surfaced — gap filled by query #5.
**Source**: thecoderashok.com, plainenglish.io, awisee.com.

### 3. `indie hacker founder vlog viewers who watches`
**Why**: validate ICP B exists and locate analogous creators.
**Findings**: Audience is "other developers and indie hackers" + "people interested in learning and business." Will Kwan and William Candillon ($6k+/mo on React Native education) cited as examples. Indie Hackers itself has explicit IH posts saying *"I couldn't find startup-focused YouTubers"* — direct evidence of unmet demand. Building in public, transparency, and vulnerability cited as success factors.
**Source**: indiehackers.com (multiple posts), foundervlogs.com, thebootstrappedfounder.com.

### 4. `creator membership monetization YouTube developer tutorials Patreon conversion rate`
**Why**: ground membership math for spec §7 turn-on thresholds.
**Findings**: Patreon 8–12% fees vs YouTube Memberships 30%, but YouTube converts 3–5× more fans because no extra signup step. Hybrid model (YouTube for casual $2–10 tier + Patreon for premium $25–100) is the dominant winning configuration. **Implication**: gBlockParty's plan to host membership on its own site (Stripe migration from BFR) sits between these — better margins than YouTube, worse conversion than YouTube. Worth flagging.
**Source**: earnifyhub.com, fluxnote.io, miraflow.ai.

### 5. `"Theo" OR "Fireship" OR "Web Dev Simplified" audience demographics tutorials`
**Why**: tutorial-channel demographic profile for ICP A.
**Findings**: Web Dev Simplified 91% male audience. Fireship 95% male per State of JS 2022. Coder Coder lower (~83%) due to introductory content. **Implication**: ICP A skews ~90% male; positioning, channel name, and visuals already align (Inter Variable + lime/coral, "Playful Brutalist" — neutral enough not to alienate but matches the prevailing aesthetic).
**Source**: dev.to, fireship.dev, awisee.com.

### 6. `build in public Twitter audience indie hackers who follows founders`
**Why**: distribution channel for ICP B.
**Findings**: X/Twitter is the canonical home of build-in-public. Most successful founders launch with 500–5k engaged followers. 15–25% conversion on engaged followers with founder pricing. **Direct evidence**: "Most founders confuse 'building in public' with 'posting on Twitter,' when it's really about consistent transparency and feedback loops" — aligns with Weekly G's scoreboard format thesis.
**Source**: indiehackers.com, teract.ai, ekofi.substack.com.

### 7. `developer learner pain points JavaScript tutorials too shallow stack overflow`
**Why**: validate tutorial-hell pain for ICP A.
**Findings**: Strong evidence: "JavaScript tutorials often start with 'In this tutorial we will write a simple…' and 12,000 lines later you can't remember what it was." Learners describe "magical incantation stage — copying random code they hope will run." Stack Overflow explicitly not for learning. **Implication**: GCanBuild's named-stack opinionated wedge is differentiated, supports the 10k+ view evidence.
**Source**: dev.to, freecodecamp.org forum, intfiction.org.

### 8. `SaaS founder content creator subscriber paid newsletter Lenny Levels.io audience`
**Why**: best paid-newsletter benchmark for ICP C.
**Findings**: Lenny: 377k free → 18k paid → $2M+/yr. ~5% paid conversion. Audience: ~50% PMs, 25%+ founders, rest engineers/designers/growth. Launched paid 9 months after free. **Implication**: ICP C's exact composition (founders + engineers paying $15+/mo for premium curation) is benchmarked here. gBlockParty's wedge: same audience, but with *technical depth tutorials* in addition to founder lessons — Lenny doesn't ship code.
**Source**: growthinreverse.com, lennysnewsletter.com, blog.getlatka.com.

## Phase 2 — Deep-Dive Research per ICP (6 queries)

### 9. `junior web developer learning Next.js full stack tutorial pain career switcher 2026`
**Why**: ICP A persona depth.
**Findings**: Next.js 16.2 shipped March 2026 (relevant for tutorial freshness). Modern stack consensus: Next.js + TS + Tailwind + Prisma + Supabase (note: gBlockParty leans Drizzle + Neon — slightly different stack, equally valid). 13-step full-stack tutorial format common. Career-switcher market explicit.
**Source**: tech-insider.org, dev.to.

### 10. `indie hacker YouTube channel revenue subscribers Levels Pieter founder vlog`
**Why**: ICP B competitive landscape.
**Findings**: Pieter Levels at $250k MRR / $3.1M ARR. Originally tried YouTube, dropped it when revenue dropped, pivoted to projects. **Implication**: even Levels couldn't sustain YouTube as a primary channel — confirms the "sustained weekly cadence" wedge is genuinely hard and underserved.
**Source**: levels.io, thebootstrappedfounder.com, indiehackers.com.

### 11. `staff senior engineer side project transition to founder content consumption habits`
**Why**: ICP C trigger events and content habits.
**Findings**: Confirmed transition is "likely the hardest thing you'll ever do." Side projects as identity-formation cited. Specific content-consumption-habits data sparse — extrapolated from Lenny's audience composition + Pragmatic Engineer (Gergely Orosz) audience overlap.
**Source**: fastcompany.com, lethain.com, freecodecamp.org.

### 12. `"tutorial hell" reddit r/webdev frustration named stack learn what to build`
**Why**: ICP A pain depth.
**Findings**: Tutorial hell is explicitly named and discussed across DEV, CodeNewbie, Quora. "Stuck in cycle of consuming tutorials without applying." Consensus solution: build your own projects. **Implication**: a tutorial that *names every library and ships a real working app* (GCanBuild's wedge) is the antidote, validating the 10k+ view performance.
**Source**: dev.to (multiple), quora.com, codenewbie.org.

### 13. `developer tutorial creator membership pricing courses YouTube Patreon $5 $10 monthly conversion`
**Why**: monetization tier design.
**Findings**: Patreon ladder: $1–2 tip jar / $3–5 early-access / $10+ premium. Course platforms 7× cheaper than Patreon at $5k/mo scale. **Implication**: gBlockParty membership at $10/mo aligns with the "premium" rung; one-time GCanBuild courses (when extracted) should price $30–100 to serve ICP A's payment preference without canibalizing membership.
**Source**: ruzuku.com, schoolmaker.com, influencermarketinghub.com.

### 14. `build in public audience demographics readers Levels.io Marc Lou indie hackers age country`
**Why**: ICP B geographic and demographic shape.
**Findings**: Marc Lou ~70k X followers in ~2 yrs from 0. Audience: indie hackers + solopreneurs. Twitter-concentrated. Specific age/country breakdowns not surfaced — extrapolated to "English-speaking global, US/Canada/UK/EU + digital nomad axis."
**Source**: indiehackers.com, startupik.com, supabird.io.

## Scoring Rationale

### Value scores (1–5)

- **B = 4.0**: pain (isolation, lack of transparent founders) is acute and unaddressed. WTP medium-high (Marc Lou conversion benchmarks). Segment ~200–500k addressable. Spec alignment HIGH.
- **A = 3.5**: pain (tutorial hell) is acute. WTP lower ($5–10 course-style preferred). Segment LARGE. Spec alignment LOW (GCanBuild is backlog).
- **C = 4.5**: pain less acute but WTP highest (Lenny benchmarks). Segment medium. gBlockParty's *uniquely-positioned* overlap (tutorials + founder content from same creator).

### Accessibility scores (1–5)

- **A = 4.5**: SEO already proven (10k+, 5.5k view tutorials). Low CAC. Short funnel. No DMU.
- **B = 3.5**: X + IH community accessible. Time-only CAC. Longer trust-building funnel (3–9 months).
- **C = 3.0**: emerges only at the overlap of A's traffic and B's reputation. Hardest to reach precisely without first delivering on A and B.

### Why B as primary despite A's higher combined score

Spec §1 explicitly states the Phase-1 strategic posture is "prove Weekly G cadence over 3 months." Selecting A as primary would contradict the stated direction. A is treated as the parallel SEO moat; C as the future conversion target.

## Data Gaps

- Specific age/country breakdowns for ICP B audience (Marc Lou, Levels). Extrapolated.
- ICP C content-consumption-habit detail. Extrapolated from Lenny audience composition.
- No primary research with George's existing YouTube subscribers — that would be the highest-value next step (in-product survey or comment analysis once Weekly G cadence is live).
