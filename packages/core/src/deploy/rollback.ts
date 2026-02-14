import type { Database } from "@gblockparty/shared/db";
import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("rollback");

export async function rollbackDeployment(
  db: Database,
  projectId: string,
  targetDeploymentId: string,
): Promise<string> {
  // TODO: Rollback flow:
  // 1. Get target deployment's image tag
  // 2. Create new deployment record (type: 'rollback', sourceDeploymentId)
  // 3. Start container from old image
  // 4. Health check
  // 5. Update Caddy routing
  // 6. Stop current container
  // 7. Return new deployment ID
  logger.info(
    { projectId, targetDeploymentId },
    "Rollback initiated",
  );
  throw new Error("Not implemented");
}
