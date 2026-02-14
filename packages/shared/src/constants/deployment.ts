export const DEPLOYMENT_STATUSES = [
  "queued",
  "building",
  "deploying",
  "ready",
  "failed",
  "archived",
] as const;

export const DEPLOYMENT_TYPES = [
  "production",
  "preview",
  "rollback",
] as const;

export const FRAMEWORKS = ["nextjs", "dockerfile", "static"] as const;

export const NEXT_MODES = ["static", "server"] as const;

export const PORT_RANGES = {
  DASHBOARD: 3000,
  PRODUCTION_MIN: 3001,
  PRODUCTION_MAX: 3999,
  PREVIEW_MIN: 4000,
  PREVIEW_MAX: 4999,
} as const;

export const BUILD_LIMITS = {
  MAX_BUILD_TIME_MS: 15 * 60 * 1000,
  MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024 * 1024,
  CONCURRENT_BUILDS: 1,
  BUILD_CACHE_SIZE_BYTES: 1 * 1024 * 1024 * 1024,
  MAX_IMAGES_PER_PROJECT: 10,
} as const;

export const HEALTH_CHECK = {
  DEFAULT_PATH: "/",
  MAX_RETRIES: 10,
  RETRY_INTERVAL_MS: 2000,
  RUNNING_INTERVAL_S: 30,
  CRASH_THRESHOLD: 3,
  CRASH_WINDOW_MS: 5 * 60 * 1000,
} as const;

export const FRAMEWORK_DEFAULTS: Record<
  string,
  { buildCommand: string; outputDir: string; devCommand: string }
> = {
  nextjs: {
    buildCommand: "pnpm build",
    outputDir: ".next",
    devCommand: "pnpm dev",
  },
  static: {
    buildCommand: "",
    outputDir: ".",
    devCommand: "npx serve .",
  },
  dockerfile: {
    buildCommand: "docker build .",
    outputDir: ".",
    devCommand: "",
  },
};
