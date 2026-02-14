import { Command } from "commander";

export const envCommand = new Command("env")
  .description("Manage environment variables");

envCommand
  .command("pull")
  .description("Download env vars to .env.local")
  .option("-s, --scope <scope>", "Environment scope", "production")
  .action(async (options: { scope: string }) => {
    // TODO: GET /api/cli/env/:projectId
    // TODO: Write to .env.local
    console.log("Env pull not yet implemented");
  });

envCommand
  .command("push")
  .description("Upload env vars from .env.local")
  .option("-s, --scope <scope>", "Environment scope", "production")
  .action(async (options: { scope: string }) => {
    // TODO: Read .env.local
    // TODO: POST /api/cli/env/:projectId
    console.log("Env push not yet implemented");
  });
