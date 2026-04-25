import { describe, it, expect } from "vitest";
import path from "node:path";
import { loadAllGBlocks, type LoadedGBlock } from "../lib/content/loader";
import { extractPreview } from "../components/PaywallCard";

const CONTENT_ROOT = path.resolve(__dirname, "../../../../content");

let blocks: LoadedGBlock[];

function getBlocks(): LoadedGBlock[] {
  if (!blocks) {
    blocks = loadAllGBlocks({ contentRoot: CONTENT_ROOT });
  }
  return blocks;
}

describe("Phase 2 regression — loadAllGBlocks against real fixtures", () => {
  it("returns 6 fixture gBlocks across 3 collections", () => {
    const all = getBlocks();
    expect(all).toHaveLength(6);

    const collections = new Set(all.map((b) => b.collection));
    expect(collections).toEqual(
      new Set(["gcanbuild", "weekly-sota", "weekly-g"]),
    );
  });

  it("includes the expected types: tutorial, episode, clip", () => {
    const types = new Set(getBlocks().map((b) => b.type));
    expect(types).toContain("tutorial");
    expect(types).toContain("episode");
    expect(types).toContain("clip");
  });
});

describe("Phase 2 regression — featured filter", () => {
  it("returns only featured blocks sorted by publishedAt desc", () => {
    const featured = getBlocks()
      .filter((b) => b.featured)
      .sort(
        (a, b) =>
          new Date(b.publishedAt ?? 0).getTime() -
          new Date(a.publishedAt ?? 0).getTime(),
      );

    expect(featured).toHaveLength(2);
    expect(featured.every((b) => b.featured)).toBe(true);

    const dates = featured.map((b) =>
      new Date(b.publishedAt ?? 0).getTime(),
    );
    expect(dates[0]!).toBeGreaterThanOrEqual(dates[1]!);
  });
});

describe("Phase 2 regression — clip filter", () => {
  it("returns only clip-type blocks", () => {
    const clips = getBlocks().filter((b) => b.type === "clip");
    expect(clips).toHaveLength(1);
    expect(clips[0]!.slug).toBe("streaming-highlight-clip");
  });
});

describe("Phase 2 regression — redirect lookup", () => {
  it("resolves every slug to its canonical /<collection>/<slug> path", () => {
    const all = getBlocks();
    const slugMap = new Map(all.map((b) => [b.slug, b.collection]));

    for (const block of all) {
      const collection = slugMap.get(block.slug);
      expect(collection).toBeDefined();
      expect(`/${collection}/${block.slug}`).toBe(
        `/${block.collection}/${block.slug}`,
      );
    }
  });

  it("finds each fixture slug in the loaded blocks", () => {
    const slugs = getBlocks().map((b) => b.slug);
    for (const expected of [
      "pastebin-clone-nextjs",
      "better-auth-tutorial",
      "sota-ep-001",
      "weekly-g-ep-001",
      "streaming-highlight-clip",
    ]) {
      expect(slugs).toContain(expected);
    }
  });
});

describe("Phase 2 regression — PaywallCard preview extraction", () => {
  it("strips HTML tags and JSX expressions from body", () => {
    const body = '<YouTube id="abc" /> Hello <Callout tone="info">world</Callout>';
    const preview = extractPreview(body);
    expect(preview).not.toMatch(/<[^>]+>/);
    expect(preview).toContain("Hello");
    expect(preview).toContain("world");
  });

  it("truncates to ~150 words and appends ellipsis", () => {
    const body = Array.from({ length: 200 }, (_, i) => `word${i}`).join(" ");
    const preview = extractPreview(body);
    const words = preview.replace("…", "").trim().split(/\s+/);
    expect(words).toHaveLength(150);
    expect(preview).toMatch(/…$/);
  });

  it("returns full text without ellipsis when body is short", () => {
    const body = "Short body text.";
    const preview = extractPreview(body);
    expect(preview).toBe("Short body text.");
    expect(preview).not.toContain("…");
  });
});
