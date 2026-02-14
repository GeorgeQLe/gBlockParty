import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("caddy");

export class CaddyClient {
  private adminUrl: string;

  constructor(adminUrl?: string) {
    this.adminUrl = adminUrl ?? process.env.CADDY_ADMIN_URL ?? "http://localhost:2019";
  }

  async addRoute(
    hostname: string,
    upstreamPort: number,
  ): Promise<void> {
    // TODO: POST to Caddy admin API to add reverse proxy route
    // hostname → localhost:upstreamPort
    logger.info({ hostname, upstreamPort }, "Adding Caddy route");
    throw new Error("Not implemented");
  }

  async removeRoute(hostname: string): Promise<void> {
    // TODO: Remove route from Caddy config
    logger.info({ hostname }, "Removing Caddy route");
    throw new Error("Not implemented");
  }

  async reloadConfig(): Promise<void> {
    // TODO: POST http://localhost:2019/load with full config
    throw new Error("Not implemented");
  }
}
