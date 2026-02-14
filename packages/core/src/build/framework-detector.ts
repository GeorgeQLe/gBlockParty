import type { Framework, NextMode } from "@gblockparty/shared/types";

export interface DetectedFramework {
  framework: Framework;
  nextMode?: NextMode;
  buildCommand: string;
  outputDir: string;
}

export async function detectFramework(
  repoPath: string,
): Promise<DetectedFramework> {
  // TODO: Detection order:
  // 1. Check for next.config.{js,ts,mjs} → nextjs (detect static vs server mode)
  // 2. Check for Dockerfile → dockerfile
  // 3. Check for index.html → static
  // 4. Throw error: "Add deploy.yaml to configure"
  throw new Error("Not implemented");
}

export function detectPackageManager(
  repoPath: string,
): "pnpm" | "npm" | "yarn" | "bun" {
  // TODO: Check lock files in order:
  // pnpm-lock.yaml → pnpm
  // package-lock.json → npm
  // yarn.lock → yarn
  // bun.lockb → bun
  // default → pnpm
  return "pnpm";
}
