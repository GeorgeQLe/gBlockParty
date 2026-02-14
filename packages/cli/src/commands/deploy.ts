import { Command } from "commander";

export const deployCommand = new Command("deploy")
  .description("Trigger a deployment")
  .option("-b, --branch <branch>", "Branch to deploy")
  .action(async (options: { branch?: string }) => {
    // TODO: Read project config
    // TODO: POST /api/cli/deploy
    // TODO: Stream build logs
    console.log("Deploy not yet implemented");
  });
