import type Dockerode from "dockerode";
import { HEALTH_CHECK } from "@gblockparty/shared/constants";

export async function waitForHealthy(
  docker: Dockerode,
  containerId: string,
  healthCheckPath: string,
  port: number,
): Promise<boolean> {
  // TODO: Poll health check endpoint with retries
  // Uses HEALTH_CHECK.MAX_RETRIES and HEALTH_CHECK.RETRY_INTERVAL_MS
  throw new Error("Not implemented");
}

export async function isContainerRunning(
  docker: Dockerode,
  containerId: string,
): Promise<boolean> {
  // TODO: Inspect container and check state
  throw new Error("Not implemented");
}

export async function getContainerPort(
  docker: Dockerode,
  containerId: string,
): Promise<number | null> {
  // TODO: Get mapped host port from container
  throw new Error("Not implemented");
}
