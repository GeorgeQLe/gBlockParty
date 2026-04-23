import { z } from "zod";

export const gBlockTypeSchema = z.enum([
  "tutorial",
  "episode",
  "essay",
  "repo",
  "tool",
  "demo",
]);
export type GBlockType = z.infer<typeof gBlockTypeSchema>;

export const gBlockSchema = z.object({
  slug: z.string().min(1),
  type: gBlockTypeSchema,
  collection: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  canonicalUrl: z.string().url().optional(),
  crossPosts: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  membership: z.enum(["free", "member"]).default("free"),
});
export type GBlock = z.infer<typeof gBlockSchema>;

export const collectionSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  frontDoorUrl: z.string().url().nullable().optional(),
});
export type Collection = z.infer<typeof collectionSchema>;
