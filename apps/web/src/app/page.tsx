import fs from "node:fs";
import path from "path";
import type { Metadata } from "next";
import { loadAllGBlocks } from "@/lib/content";

function resolveContentRoot(): string {
  const candidate = path.join(process.cwd(), "content");
  if (fs.existsSync(candidate)) return candidate;
  return path.resolve(process.cwd(), "../../content");
}
import { FeaturedRail } from "@/components/FeaturedRail";
import { ShortsRail } from "@/components/ShortsRail";
import { FirehoseFeed } from "@/components/FirehoseFeed";

export const metadata: Metadata = {
  title: "gBlockParty — Every piece of content and code is a gBlock",
  description:
    "Tutorials, episodes, clips, and tools from George Le. Browse the full library or filter by type and collection.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; collection?: string }>;
}) {
  const { type, collection } = await searchParams;
  const blocks = loadAllGBlocks({
    contentRoot: resolveContentRoot(),
  });

  if (blocks.length === 0) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-4xl font-bold">gBlockParty</h1>
        <p className="mt-4 text-lg text-muted">
          No gBlocks yet. Check back soon!
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <FeaturedRail blocks={blocks} />
      <ShortsRail blocks={blocks} />
      <FirehoseFeed
        blocks={blocks}
        activeType={type}
        activeCollection={collection}
      />
    </main>
  );
}
