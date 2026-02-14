import { App } from "@octokit/app";
import type { Octokit } from "@octokit/rest";

let app: App | null = null;

export class GitHubAppClient {
  private app: App;

  constructor() {
    if (!app) {
      app = new App({
        appId: process.env.GITHUB_APP_ID!,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
        webhooks: {
          secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
        },
      });
    }
    this.app = app;
  }

  async getInstallationOctokit(
    installationId: number,
  ): Promise<Octokit> {
    // TODO: Get installation-scoped Octokit with cached token
    throw new Error("Not implemented");
  }

  async getInstallationToken(installationId: number): Promise<string> {
    // TODO: Get or refresh installation token (1-hour expiry)
    throw new Error("Not implemented");
  }
}
