import { z } from "zod";

export const triggerDeploymentSchema = z.object({
  branch: z.string().optional(),
  commitSha: z.string().optional(),
  type: z.enum(["production", "preview"]).default("production"),
});

export const rollbackDeploymentSchema = z.object({
  targetDeploymentId: z.string().uuid(),
});

export type TriggerDeploymentInput = z.infer<typeof triggerDeploymentSchema>;
export type RollbackDeploymentInput = z.infer<typeof rollbackDeploymentSchema>;
