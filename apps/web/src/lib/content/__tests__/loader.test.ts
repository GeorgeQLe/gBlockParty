/**
 * Failing MDX loader tests — Phase 1, Step 1.3.
 *
 * These tests pin the contract that Step 1.6 will implement. They are
 * intentionally red at this step: the `../loader` and `../collections` modules
 * do not yet exist, so the imports below will fail until Step 1.6 creates them.
 *
 * Contract (documented here so Step 1.6 has a clear target):
 *
 *   loadAllGBlocks({ contentRoot }: { contentRoot: string }): GBlock[]
 *     - Walks `<contentRoot>/gblocks/<collection>/<slug>.mdx`.
 *     - Parses frontmatter with `gray-matter` and validates with `gBlockSchema`.
 *     - Includes the offending file path in the thrown error when a file fails
 *       schema validation.
 *     - Throws when the same `slug` appears in more than one collection.
 *     - Returns objects that include both the parsed frontmatter fields and
 *       the MDX body content (exposed as `content` / `body`).
 *
 *   loadCollection(slug, { collectionsRoot }): Collection
 *     - Reads `<collectionsRoot>/<slug>.yaml`.
 *     - Parses with `js-yaml` and validates with `collectionSchema.parse()`.
 *
 * Dependency injection via options (no env-var coupling) keeps fixtures
 * self-contained under `__tests__/fixtures/`.
 */

import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

// These imports intentionally resolve to modules that do not yet exist.
// The failing import is the red signal for Step 1.3.
import { loadAllGBlocks } from "../loader";
import { loadCollection } from "../collections";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "fixtures");

const validRoot = path.join(FIXTURES, "valid");
const invalidRoot = path.join(FIXTURES, "invalid");
const dupeRoot = path.join(FIXTURES, "dupe");
const collectionsRoot = path.join(FIXTURES, "collections");

describe("loadAllGBlocks", () => {
  it("returns parsed gBlocks with frontmatter and body content", () => {
    const blocks = loadAllGBlocks({ contentRoot: validRoot });

    const tutorial = blocks.find(
      (b: { slug: string }) => b.slug === "hello-tutorial",
    );
    expect(tutorial).toMatchObject({
      slug: "hello-tutorial",
      type: "tutorial",
      collection: "gcanbuild",
      title: "Hello Tutorial",
    });
  });

  it("throws with the offending file path in the error message when frontmatter fails validation", () => {
    expect(() => loadAllGBlocks({ contentRoot: invalidRoot })).toThrow(
      /broken-episode\.mdx/,
    );
  });

  it("throws on duplicate slug across collections", () => {
    expect(() => loadAllGBlocks({ contentRoot: dupeRoot })).toThrow(
      /shared-slug/,
    );
  });
});

describe("loadCollection", () => {
  it('reads and validates the fixture YAML for "gcanbuild"', () => {
    const collection = loadCollection("gcanbuild", { collectionsRoot });
    expect(collection).toMatchObject({
      slug: "gcanbuild",
      name: "gCanBuild",
    });
  });

  it("throws when YAML fails collectionSchema.parse()", () => {
    expect(() => loadCollection("bad", { collectionsRoot })).toThrow();
  });
});
