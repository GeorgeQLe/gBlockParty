import type { Octokit } from "@octokit/rest";

const BOT_COMMENT_MARKER = "<!-- gblockparty-bot -->";

export async function createOrUpdatePRComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  body: string,
): Promise<void> {
  // TODO: Search for existing bot comment, update or create
  // Marker: BOT_COMMENT_MARKER
  throw new Error("Not implemented");
}

export function formatDeploymentComment(
  status: string,
  url: string | null,
  buildDurationMs: number | null,
): string {
  const statusEmoji =
    status === "ready" ? "✅" : status === "failed" ? "❌" : "🔄";

  let comment = `${BOT_COMMENT_MARKER}\n`;
  comment += `## ${statusEmoji} Preview Deployment\n\n`;
  comment += `**Status:** ${status}\n`;
  if (url) {
    comment += `**URL:** ${url}\n`;
  }
  if (buildDurationMs) {
    comment += `**Build time:** ${(buildDurationMs / 1000).toFixed(1)}s\n`;
  }
  return comment;
}
