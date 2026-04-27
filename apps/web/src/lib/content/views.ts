import fs from "node:fs";
import path from "node:path";

interface ScrapedVideo {
  videoId: string;
  title: string;
  viewCount: number;
  publishedTimeText: string;
}

interface YouTubeViewsData {
  scrapedAt: string;
  videos: ScrapedVideo[];
}

export function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  return match?.[1] ?? null;
}

export function loadViewCounts(contentRoot: string): Map<string, number> {
  const filePath = path.resolve(contentRoot, "../data/youtube-views.json");
  if (!fs.existsSync(filePath)) return new Map();

  const raw = fs.readFileSync(filePath, "utf-8");
  const data: YouTubeViewsData = JSON.parse(raw);
  const map = new Map<string, number>();
  for (const video of data.videos) {
    map.set(video.videoId, video.viewCount);
  }
  return map;
}
