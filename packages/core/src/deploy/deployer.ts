import type { Database } from "@gblockparty/shared/db";
import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("deployer");

export interface DeployOptions {
  db: Database;
  projectId: string;
  deploymentId: string;
  imageTag: string;
  envVars: Record<string, string>;
  healthCheckPath: string;
}

export class Deployer {
  constructor(private options: DeployOptions) {}

  async deploy(): Promise<{ containerId: string; port: number; url: string }> {
    // TODO: Full deploy pipeline:
    // 1. Allocate port
    // 2. Start new container with image tag
    // 3. Health check (retry loop)
    // 4. Update Caddy routing
    // 5. Stop old container
    // 6. Update deployment record
    logger.info(
      {
        projectId: this.options.projectId,
        deploymentId: this.options.deploymentId,
      },
      "Deployment started",
    );
    throw new Error("Not implemented");
  }
}
