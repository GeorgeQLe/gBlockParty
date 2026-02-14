import type { Octokit } from "@octokit/rest";

export type StatusState = "pending" | "success" | "failure" | "error";

export async function setCommitStatus(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string,
  state: StatusState,
  options: {
    targetUrl?: string;
    description?: string;
    context?: string;
  } = {},
): Promise<void> {
  // TODO: Set commit status via GitHub API
  throw new Error("Not implemented");
}
