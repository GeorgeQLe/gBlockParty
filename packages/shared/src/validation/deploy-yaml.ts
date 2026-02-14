import { z } from "zod";

const healthCheckSchema = z.object({
  path: z.string().default("/"),
});

const resourceSchema = z.object({
  cpu: z.number().int().positive(),
  memory: z.number().int().positive(),
});

const serviceSchema = z.object({
  type: z.enum(["nextjs", "dockerfile", "static"]),
  path: z.string().optional(),
  dockerfile: z.string().optional(),
  port: z.number().int().min(1).max(65535).default(3000),
  resources: resourceSchema.optional(),
  healthCheck: healthCheckSchema.optional(),
});

export const deployYamlSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["nextjs", "dockerfile", "static"]).optional(),
  port: z.number().int().min(1).max(65535).optional(),
  dockerfile: z.string().optional(),
  resources: resourceSchema.optional(),
  healthCheck: healthCheckSchema.optional(),
  services: z.record(z.string(), serviceSchema).optional(),
});

export type DeployYamlConfig = z.infer<typeof deployYamlSchema>;
