import type { GBlock } from "@gblockparty/gblock-schema";
import { GBlockCard } from "./GBlockCard";

export interface ShortsRailProps {
  blocks: GBlock[];
}

export function ShortsRail({ blocks }: ShortsRailProps) {
  const clips = blocks.filter((b) => b.type === "clip");

  if (clips.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-bold">Shorts</h2>
      <div className="mt-4 flex gap-6 overflow-x-auto pb-4">
        {clips.map((block) => (
          <div key={block.slug} className="w-72 flex-none">
            <GBlockCard block={block} />
          </div>
        ))}
      </div>
    </section>
  );
}
