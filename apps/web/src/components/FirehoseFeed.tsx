import type { GBlock, GBlockType } from "@gblockparty/gblock-schema";
import { GBlockCard } from "./GBlockCard";

const ALL_TYPES: GBlockType[] = [
  "tutorial",
  "essay",
  "episode",
  "stream",
  "clip",
  "repo",
  "tool",
  "demo",
];

const COLLECTIONS = ["gcanbuild", "weekly-sota", "weekly-g"];

export interface FirehoseFeedProps {
  blocks: GBlock[];
  activeType?: string;
  activeCollection?: string;
}

export function FirehoseFeed({
  blocks,
  activeType,
  activeCollection,
}: FirehoseFeedProps) {
  let filtered = blocks
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

  if (activeType) {
    filtered = filtered.filter((b) => b.type === activeType);
  }
  if (activeCollection) {
    filtered = filtered.filter((b) => b.collection === activeCollection);
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-bold">All gBlocks</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip href="/" label="All" active={!activeType && !activeCollection} />
        {ALL_TYPES.map((t) => (
          <FilterChip
            key={t}
            href={`/?type=${t}`}
            label={t}
            active={activeType === t}
          />
        ))}
        {COLLECTIONS.map((c) => (
          <FilterChip
            key={c}
            href={`/?collection=${c}`}
            label={c}
            active={activeCollection === c}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-ink-soft">No gBlocks yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((block) => (
            <GBlockCard key={block.slug} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`inline-block rounded-sm border-[length:var(--border-width-hard)] border-ink px-3 py-1 text-xs font-medium capitalize transition-colors duration-[var(--duration-base)] ${
        active
          ? "bg-ink text-paper"
          : "bg-surface text-ink-soft hover:bg-muted"
      }`}
    >
      {label}
    </a>
  );
}
