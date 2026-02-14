import { Command } from "commander";

export const rollbackCommand = new Command("rollback")
  .description("Rollback to a previous deployment")
  .argument("[deploymentId]", "Target deployment ID")
  .action(async (deploymentId?: string) => {
    // TODO: If no deploymentId, list recent deployments for interactive selection
    // TODO: POST /api/projects/:id/deployments/:did/rollback
    console.log("Rollback not yet implemented");
  });
