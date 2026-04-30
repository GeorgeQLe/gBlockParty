# gBlockParty

> Every piece of content and code is a gBlock.

gBlockParty is the canonical home for all of George's content and code. Tutorials, podcast episodes, essays, tools, demos, and repositories are all **gBlocks** — atomic, indexable artifacts that live in one place and can be surfaced across multiple front doors.

Current operating plan: keep the existing George Le YouTube channel as the single hub and prove Weekly G for 3 months. GCanBuild and Weekly SOTA remain supported collections, but they are optional playlists/backlog until Weekly G has shipped consistently.

## Decisions already made (context for /spec-interview)

This repo was scaffolded on 2026-04-23 after a strategic conversation. The following are settled:

- **Canonical brand.** gBlockParty is the umbrella. Domain: `gblockparty.com` (already owned).
- **BFR dropped as a separate brand/domain.** No `bfr.fm` purchase. Former Boston Founder Radio material is source material only now: it can be mined and absorbed into active gBlockParty collections, but BFR is not a live collection on the site.
- **Old repos archived.** `GeorgeQLe/gBlockParty` (old deployment-platform scaffolding) and `GeorgeQLe/boston-founder-radio-v1` are archived. Their content/specs can be mined later but none of their code is carried forward.
- **Atomic unit is the gBlock.** See `packages/gblock-schema/src/index.ts`. A gBlock has `type` (tutorial / episode / essay / repo / tool / demo), `collection` (GCanBuild, Weekly SOTA, Weekly G, …), and optional `membership` gating (free / member).
- **Collections group gBlocks.** They are tags with identity — a name, a description, optionally their own front door. Collections do **not** own their own repos, domains, or separate YouTube channels by default.
- **Content in-repo, file-backed.** MDX/YAML in `content/` rather than a DB. Git history per gBlock. Can move to Neon later if scale demands it.
- **Membership is platform-level, not per-collection.** A single gBlockParty membership unlocks premium gBlocks across all collections. Stripe plumbing migrates from the BFR v1 repo when we get there.
- **War-room separation.** `lexcorp-war-room`'s `portfolio/*.yaml` remains the private ops dashboard. Weekly G uses lightweight recording artifacts for now; custom War Room recording infrastructure is deferred until the format proves itself.

## Resolved strategy

The original `/spec-interview` questions are resolved in `specs/gblockparty-v1.md`. The post-v1 adjustment is deliberately narrower:

1. **One channel.** Keep the existing George Le channel; use playlists for WeeklyG, Technical Deep Dives, Build Logs, Livestream VODs, and Founder Interviews.
2. **One required cadence.** Publish Weekly G weekly for 3 months before adding a second standing format.
3. **Lightweight War Room visuals.** Use Notion, Sheets, GitHub, Linear, or slides for the first 10 episodes.
4. **Channel cleanup.** Unlist off-brand VODs/promos and resolve the abandoned Mailchimp Clone series by finishing it or unlisting it with a pivot explanation.

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
2. Record and upload Weekly G Ep 1.
3. Author the Weekly G Ep 1 MDX canary and unhide the Weekly G collection.
4. Create the lightweight Weekly G episode template.
5. Complete the YouTube channel cleanup audit.
