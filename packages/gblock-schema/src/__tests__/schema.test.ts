import { describe, it, expect } from "vitest";
import { gBlockSchema } from "../index";

const base = (overrides: Record<string, unknown> = {}) => ({
  slug: "sample-slug",
  collection: "gcanbuild",
  title: "Sample Title",
  publishedAt: "2026-04-24T00:00:00.000Z",
  ...overrides,
});

const tutorial = (overrides: Record<string, unknown> = {}) =>
  base({ type: "tutorial", ...overrides });
const essay = (overrides: Record<string, unknown> = {}) =>
  base({ type: "essay", ...overrides });
const episode = (overrides: Record<string, unknown> = {}) =>
  base({ type: "episode", ...overrides });
const stream = (overrides: Record<string, unknown> = {}) =>
  base({
    type: "stream",
    videoUrl: "https://example.com/stream",
    startedAt: "2026-04-24T00:00:00.000Z",
    ...overrides,
  });
const clip = (overrides: Record<string, unknown> = {}) =>
  base({ type: "clip", videoUrl: "https://example.com/clip", ...overrides });
const repo = (overrides: Record<string, unknown> = {}) =>
  base({ type: "repo", repoUrl: "https://github.com/x/y", ...overrides });
const tool = (overrides: Record<string, unknown> = {}) =>
  base({ type: "tool", demoUrl: "https://example.com/tool", ...overrides });
const demo = (overrides: Record<string, unknown> = {}) =>
  base({ type: "demo", demoUrl: "https://example.com/demo", ...overrides });

describe("gBlockSchema discriminated union", () => {
  it("parses a valid tutorial", () => {
    expect(gBlockSchema.parse(tutorial())).toMatchObject({ type: "tutorial" });
  });

  it("parses a valid essay", () => {
    expect(gBlockSchema.parse(essay())).toMatchObject({ type: "essay" });
  });

  it("rejects an episode with neither videoUrl nor audioUrl", () => {
    expect(() => gBlockSchema.parse(episode())).toThrow();
  });

  it("accepts an episode with only videoUrl", () => {
    expect(
      gBlockSchema.parse(episode({ videoUrl: "https://example.com/v" })),
    ).toMatchObject({ type: "episode", videoUrl: "https://example.com/v" });
  });

  it("accepts an episode with only audioUrl", () => {
    expect(
      gBlockSchema.parse(episode({ audioUrl: "https://example.com/a.mp3" })),
    ).toMatchObject({ type: "episode", audioUrl: "https://example.com/a.mp3" });
  });

  it("rejects a stream missing videoUrl", () => {
    const { videoUrl: _v, ...rest } = stream();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects a stream missing startedAt", () => {
    const { startedAt: _s, ...rest } = stream();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects a clip missing videoUrl", () => {
    const { videoUrl: _v, ...rest } = clip();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects a repo missing repoUrl", () => {
    const { repoUrl: _r, ...rest } = repo();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects a tool missing demoUrl", () => {
    const { demoUrl: _d, ...rest } = tool();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects a demo missing demoUrl", () => {
    const { demoUrl: _d, ...rest } = demo();
    expect(() => gBlockSchema.parse(rest)).toThrow();
  });

  it("rejects an unknown type", () => {
    expect(() => gBlockSchema.parse(base({ type: "mystery" }))).toThrow();
  });

  it("accepts shared optional fields on any type", () => {
    const input = tutorial({
      heroImage: "/hero.png",
      featured: true,
      seriesSlug: "intro-series",
      videoUrl: "https://example.com/v",
    });
    expect(gBlockSchema.parse(input)).toMatchObject({
      heroImage: "/hero.png",
      featured: true,
      seriesSlug: "intro-series",
      videoUrl: "https://example.com/v",
    });
  });

  it("defaults membership to 'free' when omitted", () => {
    expect(gBlockSchema.parse(tutorial())).toMatchObject({ membership: "free" });
  });
});
