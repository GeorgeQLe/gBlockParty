import Dockerode from "dockerode";

let client: Dockerode | null = null;

export function createDockerClient(): Dockerode {
  if (!client) {
    client = new Dockerode({
      socketPath: process.env.DOCKER_SOCKET ?? "/var/run/docker.sock",
    });
  }
  return client;
}

export async function buildImage(
  docker: Dockerode,
  contextPath: string,
  tag: string,
  dockerfile?: string,
): Promise<void> {
  // TODO: Build Docker image from context directory
  throw new Error("Not implemented");
}

export async function runContainer(
  docker: Dockerode,
  image: string,
  name: string,
  port: number,
  envVars: Record<string, string>,
): Promise<string> {
  // TODO: Create and start container, return container ID
  throw new Error("Not implemented");
}

export async function stopContainer(
  docker: Dockerode,
  containerId: string,
  timeoutSeconds = 30,
): Promise<void> {
  // TODO: Graceful stop with SIGTERM, then SIGKILL after timeout
  throw new Error("Not implemented");
}

export async function getContainerLogs(
  docker: Dockerode,
  containerId: string,
  tail?: number,
): Promise<string> {
  // TODO: Fetch container logs
  throw new Error("Not implemented");
}

export async function pruneImages(
  docker: Dockerode,
  projectName: string,
  keepCount: number,
): Promise<void> {
  // TODO: Remove old images, keep latest N
  throw new Error("Not implemented");
}
