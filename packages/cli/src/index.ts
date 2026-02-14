import { Command } from "commander";
import { loginCommand } from "./commands/login";
import { linkCommand } from "./commands/link";
import { deployCommand } from "./commands/deploy";
import { envCommand } from "./commands/env";
import { logsCommand } from "./commands/logs";
import { rollbackCommand } from "./commands/rollback";

const program = new Command();

program
  .name("gblockparty")
  .description("Deploy web apps to your own VPS")
  .version("0.0.1");

program.addCommand(loginCommand);
program.addCommand(linkCommand);
program.addCommand(deployCommand);
program.addCommand(envCommand);
program.addCommand(logsCommand);
program.addCommand(rollbackCommand);

program.parse();
