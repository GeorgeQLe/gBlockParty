import type { NextMode } from "@gblockparty/shared/types";

export function generateDockerfile(
  framework: string,
  options: {
    nextMode?: NextMode;
    packageManager?: string;
    buildCommand?: string;
    outputDir?: string;
  } = {},
): string {
  switch (framework) {
    case "nextjs":
      return options.nextMode === "static"
        ? generateNextStaticDockerfile(options)
        : generateNextServerDockerfile(options);
    case "static":
      return generateStaticDockerfile();
    default:
      throw new Error(`Cannot generate Dockerfile for framework: ${framework}`);
  }
}

function generateNextServerDockerfile(options: {
  packageManager?: string;
  buildCommand?: string;
}): string {
  const pm = options.packageManager ?? "pnpm";
  const buildCmd = options.buildCommand ?? `${pm} build`;

  return `FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${buildCmd}

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
`;
}

function generateNextStaticDockerfile(options: {
  packageManager?: string;
  buildCommand?: string;
}): string {
  const pm = options.packageManager ?? "pnpm";
  const buildCmd = options.buildCommand ?? `${pm} build`;

  return `FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${buildCmd}

FROM caddy:2-alpine AS runner
COPY --from=builder /app/out /app/out
EXPOSE 3000
CMD ["caddy", "file-server", "--root", "/app/out", "--listen", ":3000"]
`;
}

function generateStaticDockerfile(): string {
  return `FROM caddy:2-alpine
COPY . /app/public
EXPOSE 3000
CMD ["caddy", "file-server", "--root", "/app/public", "--listen", ":3000"]
`;
}
