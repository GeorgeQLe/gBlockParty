import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { loadAllGBlocks, type LoadedGBlock } from "../lib/content/loader";
import { extractPreview } from "../components/PaywallCard";
import { loadViewCounts, extractVideoId } from "../lib/content/views";

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

describe("Phase 3 regression — canary content", () => {
  it("no placeholder video IDs in canary blocks", () => {
    const canaries = getBlocks().filter((b) => b.type !== "clip");
    for (const block of canaries) {
      if (block.videoUrl) {
        expect(block.videoUrl).not.toContain("dQw4w9WgXcQ");
      }
    }
  });

  it("all 3 GCanBuild canaries are tutorials", () => {
    const gcanbuildCanaries = getBlocks().filter(
      (b) => b.collection === "gcanbuild" && b.type !== "clip",
    );
    expect(gcanbuildCanaries).toHaveLength(3);
    for (const block of gcanbuildCanaries) {
      expect(block.type).toBe("tutorial");
    }
  });

  it("SOTA canary has type episode and videoUrl", () => {
    const sota = getBlocks().find((b) => b.slug === "sota-ep-001");
    expect(sota).toBeDefined();
    expect(sota!.type).toBe("episode");
    expect(sota!.videoUrl).toBeDefined();
  });

  it("at least 2 featured canaries", () => {
    const featured = getBlocks().filter((b) => b.featured);
    expect(featured.length).toBeGreaterThanOrEqual(2);
  });

  it("full-stack-web-app slug exists", () => {
    const slugs = getBlocks().map((b) => b.slug);
    expect(slugs).toContain("full-stack-web-app");
  });
});

describe("Phase 4 regression — loadViewCounts", () => {
  it("returns empty map when youtube-views.json does not exist", () => {
    const map = loadViewCounts("/nonexistent/path/content");
    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(0);
  });

  it("parses valid JSON and returns correct videoId → count map", () => {
    const tmpDir = fs.mkdtempSync(path.join("/tmp", "views-test-"));
    const dataDir = path.join(tmpDir, "data");
    const contentDir = path.join(tmpDir, "content");
    fs.mkdirSync(dataDir);
    fs.mkdirSync(contentDir);
    fs.writeFileSync(
      path.join(dataDir, "youtube-views.json"),
      JSON.stringify({
        scrapedAt: "2026-04-27T06:00:00Z",
        videos: [
          { videoId: "abc123", title: "Video A", viewCount: 1500, publishedTimeText: "1 day ago" },
          { videoId: "def456", title: "Video B", viewCount: 300, publishedTimeText: "3 days ago" },
        ],
      }),
    );

    const map = loadViewCounts(contentDir);
    expect(map.size).toBe(2);
    expect(map.get("abc123")).toBe(1500);
    expect(map.get("def456")).toBe(300);

    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe("Phase 4 regression — extractVideoId", () => {
  it("extracts from /watch?v= URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=NzfKEbgvA0A")).toBe("NzfKEbgvA0A");
  });

  it("extracts from /shorts/ URL", () => {
    expect(extractVideoId("https://www.youtube.com/shorts/abc123")).toBe("abc123");
  });

  it("extracts from /embed/ URL", () => {
    expect(extractVideoId("https://www.youtube.com/embed/def456")).toBe("def456");
  });

  it("extracts from youtu.be/ URL", () => {
    expect(extractVideoId("https://youtu.be/ghi789")).toBe("ghi789");
  });

  it("returns null for invalid URL", () => {
    expect(extractVideoId("https://example.com/video")).toBeNull();
    expect(extractVideoId("not-a-url")).toBeNull();
  });
});

describe("Phase 4 regression — scraper script", () => {
  const scraperPath = path.resolve(__dirname, "../../../../scripts/scrape-youtube.mjs");

  it("scraper script exists", () => {
    expect(fs.existsSync(scraperPath)).toBe(true);
  });

  it("scraper script is valid ESM (passes node --check)", () => {
    expect(() => execSync(`node --check "${scraperPath}"`)).not.toThrow();
  });
});
