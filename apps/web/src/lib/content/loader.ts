import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { gBlockSchema, type GBlock } from "@gblockparty/gblock-schema";
import { gblocksDir } from "./paths";

export interface LoadAllGBlocksOptions {
  contentRoot: string;
}

export type LoadedGBlock = GBlock & { body: string };

export function loadAllGBlocks(options: LoadAllGBlocksOptions): LoadedGBlock[] {
  const root = gblocksDir(options.contentRoot);
  if (!fs.existsSync(root)) return [];

  const blocks: LoadedGBlock[] = [];
  const seen = new Map<string, string>();

  for (const collection of fs.readdirSync(root, { withFileTypes: true })) {
    if (!collection.isDirectory()) continue;
    const collectionDir = path.join(root, collection.name);

    for (const entry of fs.readdirSync(collectionDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;

      const filePath = path.join(collectionDir, entry.name);
      const relative = path.relative(options.contentRoot, filePath);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);

      const parsed = gBlockSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`${relative}: ${parsed.error.message}`);
      }

      const block = parsed.data;
      const prior = seen.get(block.slug);
      if (prior) {
        throw new Error(
          `Duplicate slug "${block.slug}" in ${relative} (also in ${prior})`,
        );
      }
      seen.set(block.slug, relative);

      blocks.push({ ...block, body: content });
    }
  }

  return blocks;
}
