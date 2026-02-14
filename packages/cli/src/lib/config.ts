import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

interface CliConfig {
  token?: string;
  apiUrl?: string;
}

interface ProjectConfig {
  projectId: string;
}

const CONFIG_DIR = join(homedir(), ".gblockparty");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const PROJECT_CONFIG_FILE = ".gblockparty/config.json";

export function getGlobalConfig(): CliConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function saveGlobalConfig(config: CliConfig): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getProjectConfig(): ProjectConfig | null {
  try {
    return JSON.parse(readFileSync(PROJECT_CONFIG_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export function saveProjectConfig(config: ProjectConfig): void {
  mkdirSync(".gblockparty", { recursive: true });
  writeFileSync(PROJECT_CONFIG_FILE, JSON.stringify(config, null, 2));
}
