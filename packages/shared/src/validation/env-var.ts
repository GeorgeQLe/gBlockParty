import { z } from "zod";

export const createEnvVarSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(256)
    .regex(/^[A-Z_][A-Z0-9_]*$/, "Must be uppercase with underscores"),
  value: z.string().max(65536),
  scope: z.enum(["production", "preview"]),
  isSecret: z.boolean().default(false),
});

export const updateEnvVarSchema = z.object({
  value: z.string().max(65536).optional(),
  isSecret: z.boolean().optional(),
});

export type CreateEnvVarInput = z.infer<typeof createEnvVarSchema>;
export type UpdateEnvVarInput = z.infer<typeof updateEnvVarSchema>;
