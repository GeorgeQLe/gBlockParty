export type GitHubAccountType = "User" | "Organization";

export interface GitHubInstallation {
  id: number;
  githubAccountLogin: string;
  githubAccountType: GitHubAccountType;
  createdAt: Date;
}

export interface WebhookPayload {
  action: string;
  installation?: {
    id: number;
    account: {
      login: string;
      type: string;
    };
  };
  repository?: {
    full_name: string;
    default_branch: string;
    clone_url: string;
  };
  ref?: string;
  after?: string;
  before?: string;
  pull_request?: {
    number: number;
    head: {
      sha: string;
      ref: string;
    };
    base: {
      ref: string;
    };
    merged: boolean;
  };
  sender?: {
    login: string;
    id: number;
  };
}
