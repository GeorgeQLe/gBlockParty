import path from "node:path";

export function gblocksDir(contentRoot: string): string {
  return path.join(contentRoot, "gblocks");
}

export function collectionFile(
  collectionsRoot: string,
  slug: string,
): string {
  return path.join(collectionsRoot, `${slug}.yaml`);
}
