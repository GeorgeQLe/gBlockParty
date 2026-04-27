#!/usr/bin/env node

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHANNEL_URL = "https://www.youtube.com/@GeorgeLe/videos";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "data", "youtube-views.json");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; gBlockParty/1.0)" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetch(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function extractYtInitialData(html) {
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start === -1) return null;

  const jsonStart = start + marker.length;
  let depth = 0;
  let i = jsonStart;
  for (; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;

  try {
    return JSON.parse(html.slice(jsonStart, i + 1));
  } catch {
    return null;
  }
}

function extractVideos(data) {
  const tabs =
    data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];

  const videosTab = tabs.find(
    (t) => t.tabRenderer?.title === "Videos"
  );
  if (!videosTab) return [];

  const contents =
    videosTab.tabRenderer?.content?.richGridRenderer?.contents ?? [];

  return contents
    .map((item) => item.richItemRenderer?.content?.videoRenderer)
    .filter(Boolean)
    .map((v) => ({
      videoId: v.videoId,
      title: v.title?.runs?.[0]?.text ?? "",
      viewCount: parseViewCount(v.viewCountText?.simpleText ?? ""),
      publishedTimeText: v.publishedTimeText?.simpleText ?? "",
    }));
}

function parseViewCount(text) {
  const match = text.replace(/,/g, "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

async function main() {
  console.log(`Fetching ${CHANNEL_URL} ...`);
  const html = await fetch(CHANNEL_URL);

  const data = extractYtInitialData(html);
  if (!data) {
    console.error("ERROR: Could not extract ytInitialData from page HTML.");
    process.exit(1);
  }

  const videos = extractVideos(data);
  if (videos.length === 0) {
    console.warn("WARNING: Extracted 0 videos — page structure may have changed.");
    process.exit(1);
  }

  const output = {
    scrapedAt: new Date().toISOString(),
    videos,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log(`Wrote ${videos.length} videos to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Scraper failed:", err.message);
  process.exit(1);
});
