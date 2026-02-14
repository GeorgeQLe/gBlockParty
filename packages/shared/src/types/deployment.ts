export type DeploymentStatus =
  | "queued"
  | "building"
  | "deploying"
  | "ready"
  | "failed"
  | "archived";

export type DeploymentType = "production" | "preview" | "rollback";

export interface Deployment {
  id: string;
  projectId: string;
  type: DeploymentType;
  status: DeploymentStatus;
  commitSha: string | null;
  branch: string | null;
  prNumber: number | null;
  dockerImageTag: string | null;
  containerId: string | null;
  port: number | null;
  url: string | null;
  buildDurationMs: number | null;
  buildLogS3Key: string | null;
  errorMessage: string | null;
  sourceDeploymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
