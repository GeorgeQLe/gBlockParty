import type { GBlock } from "@gblockparty/gblock-schema";
import { GBlockCard } from "./GBlockCard";

export interface FeaturedRailProps {
  blocks: GBlock[];
}

export function FeaturedRail({ blocks }: FeaturedRailProps) {
  const featured = blocks
    .filter((b) => b.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    )
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-bold">Featured</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((block) => (
          <GBlockCard key={block.slug} block={block} />
        ))}
      </div>
    </section>
  );
}
