import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  githubRepoFullName: z.string().regex(/^[^/]+\/[^/]+$/),
  githubInstallationId: z.number().int().positive(),
  productionBranch: z.string().default("main"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  framework: z.enum(["nextjs", "dockerfile", "static"]).nullable().optional(),
  nextMode: z.enum(["static", "server"]).nullable().optional(),
  buildCommand: z.string().nullable().optional(),
  outputDir: z.string().nullable().optional(),
  productionBranch: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
