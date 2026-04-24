import { z } from "zod";

export const gBlockTypeSchema = z.enum([
  "tutorial",
  "essay",
  "episode",
  "stream",
  "clip",
  "repo",
  "tool",
  "demo",
]);
export type GBlockType = z.infer<typeof gBlockTypeSchema>;

const baseSchema = z.object({
  slug: z.string().min(1),
  collection: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  canonicalUrl: z.string().url().optional(),
  crossPosts: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  membership: z.enum(["free", "member"]).default("free"),
  heroImage: z.string().optional(),
  videoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  seriesSlug: z.string().optional(),
});

const tutorialSchema = baseSchema.extend({
  type: z.literal("tutorial"),
  readingTimeMinutes: z.number().optional(),
});

const essaySchema = baseSchema.extend({
  type: z.literal("essay"),
  readingTimeMinutes: z.number().optional(),
});

const episodeSchema = baseSchema.extend({
  type: z.literal("episode"),
  audioUrl: z.string().url().optional(),
});

const streamSchema = baseSchema.extend({
  type: z.literal("stream"),
  videoUrl: z.string().url(),
  startedAt: z.string().datetime(),
});

const clipSchema = baseSchema.extend({
  type: z.literal("clip"),
  videoUrl: z.string().url(),
  parentSlug: z.string().optional(),
});

const repoSchema = baseSchema.extend({
  type: z.literal("repo"),
  repoUrl: z.string().url(),
});

const toolSchema = baseSchema.extend({
  type: z.literal("tool"),
  demoUrl: z.string().url(),
});

const demoSchema = baseSchema.extend({
  type: z.literal("demo"),
  demoUrl: z.string().url(),
});

export const gBlockSchema = z
  .discriminatedUnion("type", [
    tutorialSchema,
    essaySchema,
    episodeSchema,
    streamSchema,
    clipSchema,
    repoSchema,
    toolSchema,
    demoSchema,
  ])
  .superRefine((v, ctx) => {
    if (v.type === "episode" && !v.videoUrl && !v.audioUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "episode requires videoUrl or audioUrl",
      });
    }
  });
export type GBlock = z.infer<typeof gBlockSchema>;

export const collectionSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  frontDoorUrl: z.string().url().nullable().optional(),
});
export type Collection = z.infer<typeof collectionSchema>;
