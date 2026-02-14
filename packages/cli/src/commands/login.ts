import { Command } from "commander";

export const loginCommand = new Command("login")
  .description("Authenticate with gBlockParty via GitHub")
  .action(async () => {
    // TODO: Open browser to OAuth URL
    // TODO: Start local server to receive callback
    // TODO: Save token to config
    console.log("Login not yet implemented");
  });
