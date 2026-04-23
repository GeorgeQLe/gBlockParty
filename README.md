# gBlockParty

> Every piece of content and code is a gBlock.

gBlockParty is the canonical home for all of George's content and code. Tutorials, podcast episodes, essays, tools, demos, and repositories are all **gBlocks** — atomic, indexable artifacts that live in one place and can be surfaced across multiple front doors.

## Decisions already made (context for /spec-interview)

This repo was scaffolded on 2026-04-23 after a strategic conversation. The following are settled:

- **Canonical brand.** gBlockParty is the umbrella. Domain: `gblockparty.com` (already owned).
- **BFR dropped as a separate brand/domain.** No `bfr.fm` purchase. "Boston Founder Radio" survives as a **collection** inside gBlockParty — same way a podcast network hosts multiple shows without each show owning its own TLD.
- **Old repos archived.** `GeorgeQLe/gBlockParty` (old deployment-platform scaffolding) and `GeorgeQLe/boston-founder-radio-v1` are archived. Their content/specs can be mined later but none of their code is carried forward.
- **Atomic unit is the gBlock.** See `packages/gblock-schema/src/index.ts`. A gBlock has `type` (tutorial / episode / essay / repo / tool / demo), `collection` (BFR, GCanBuild, …), and optional `membership` gating (free / member).
- **Collections group gBlocks.** They are tags with identity — a name, a description, optionally their own front door. Collections do **not** own their own repos or domains by default.
- **Content in-repo, file-backed.** MDX/YAML in `content/` rather than a DB. Git history per gBlock. Can move to Neon later if scale demands it.
- **Membership is platform-level, not per-collection.** A single gBlockParty membership unlocks premium gBlocks across all collections. Stripe plumbing migrates from the BFR v1 repo when we get there.
- **War-room separation.** `lexcorp-war-room`'s `portfolio/*.yaml` remains the private ops dashboard. A single `portfolio/gblockparty.yaml` entry rolls up content KPIs; `boston-founder-radio.yaml` will be decommissioned.

## Open questions for /spec-interview

The scaffold intentionally stops short of design and content strategy. The following need answers before building out:

1. **Visual system.** The stated direction is neo-brutalist / boxy / Duolingo-adjacent. The old `gBlockParty` repo's `globals.css` was empty (`@import "tailwindcss"` only) — there is no existing design system to copy. Needs: color palette, border + hard-shadow system, typography scale, radius scale, motion rules. Tailwind v4 is wired up and ready to receive tokens.
2. **Site IA.** Home is a firehose? A curated front page? Collection-first? How do gBlocks surface — chronological, by collection, by type, by tag?
3. **gBlock URL scheme.** `/g/<slug>`? `/<collection>/<slug>`? Both with a canonical?
4. **Content authoring format.** MDX per gBlock is the default assumption. Confirm, and decide frontmatter extensions beyond `gblock-schema` (hero image, audio URL for episodes, repo URL for code gBlocks, etc.).
5. **Membership gating.** Which gBlock types default to paid? How does a member-only gBlock render for non-members — paywall, preview, or hidden?
6. **Migration plan.** What existing BFR v1 content (if any) migrates in the canary pass? Is there drafted GCanBuild content anywhere to seed with?
7. **Portfolio rollup.** Which KPIs from the old `boston-founder-radio.yaml` carry forward onto `gblockparty.yaml` (paying members, MRR, weekly listens) — and which get rethought now that membership is platform-level?

## Structure

```
gblockparty/
  apps/
    web/                     # gblockparty.com — Next 15 + React 19 + Tailwind 4
  packages/
    gblock-schema/           # Zod schemas for gBlock + Collection
  content/
    gblocks/                 # one file per gBlock (MDX planned)
    collections/             # one YAML per collection
```

## Stack

- pnpm workspaces + Turborepo
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 (PostCSS plugin)
- TypeScript strict
- Zod for schema validation
- Deploy target: Vercel (auto-deploy on push)

## Next steps

1. Install deps: `pnpm install`
2. Run `/spec-interview` to resolve the open questions above and produce a design doc + phase-1 todo list.
3. Scaffold design tokens in `apps/web/src/app/globals.css` per the spec.
4. Build gBlock loader + index page.
5. Create Vercel project, point `gblockparty.com` at it.
6. Migrate one BFR artifact + one GCanBuild draft as canaries.
7. Update `lexcorp-war-room`: decommission `portfolio/boston-founder-radio.yaml`, add `portfolio/gblockparty.yaml`.
