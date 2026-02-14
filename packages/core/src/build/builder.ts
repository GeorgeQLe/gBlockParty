import type { Database } from "@gblockparty/shared/db";
import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("build-runner");

export interface BuildRunnerOptions {
  db: Database;
  projectId: string;
  commitSha: string;
  branch: string;
  cloneUrl: string;
  installationId: number;
}

export class BuildRunner {
  constructor(private options: BuildRunnerOptions) {}

  async run(): Promise<{ imageTag: string; durationMs: number }> {
    // TODO: Full build pipeline:
    // 1. Clone repo (shallow, specific commit)
    // 2. Read deploy.yaml or auto-detect framework
    // 3. Restore build cache from S3
    // 4. Install dependencies
    // 5. Run build command
    // 6. Build Docker image
    // 7. Save build cache to S3
    // 8. Return image tag and duration
    logger.info(
      { projectId: this.options.projectId, commitSha: this.options.commitSha },
      "Build started",
    );
    throw new Error("Not implemented");
  }
}
