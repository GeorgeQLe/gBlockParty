import type { Database } from "@gblockparty/shared/db";
import { PORT_RANGES } from "@gblockparty/shared/constants";

export class PortAllocator {
  constructor(private db: Database) {}

  async allocate(
    deploymentId: string,
    type: "production" | "preview",
  ): Promise<number> {
    // TODO: Find next available port in the appropriate range
    // Production: 3001-3999
    // Preview: 4000-4999
    // Insert into port_allocations table
    throw new Error("Not implemented");
  }

  async release(port: number): Promise<void> {
    // TODO: Remove from port_allocations table
    throw new Error("Not implemented");
  }

  async getUsedPorts(): Promise<number[]> {
    // TODO: Query all allocated ports
    throw new Error("Not implemented");
  }
}
