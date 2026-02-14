import { Command } from "commander";

export const linkCommand = new Command("link")
  .description("Link current directory to a gBlockParty project")
  .action(async () => {
    // TODO: Fetch projects list from API
    // TODO: Interactive project selection
    // TODO: Save project ID to .gblockparty/config.json
    console.log("Link not yet implemented");
  });
