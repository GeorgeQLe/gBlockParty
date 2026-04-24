import fs from "node:fs";
import yaml from "js-yaml";
import { collectionSchema, type Collection } from "@gblockparty/gblock-schema";
import { collectionFile } from "./paths";

export interface LoadCollectionOptions {
  collectionsRoot: string;
}

export function loadCollection(
  slug: string,
  options: LoadCollectionOptions,
): Collection {
  const filePath = collectionFile(options.collectionsRoot, slug);
  const raw = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(raw);
  return collectionSchema.parse(data);
}
