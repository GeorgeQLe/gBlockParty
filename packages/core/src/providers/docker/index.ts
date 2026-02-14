import type {
  DeploymentProvider,
  ServiceConfig,
  Service,
  ServiceStatus,
  LogOptions,
} from "../types";
import { createDockerClient } from "./client";

export class DockerProvider implements DeploymentProvider {
  private docker = createDockerClient();

  async createService(config: ServiceConfig): Promise<Service> {
    // TODO: Create container with config, start it, return service info
    throw new Error("Not implemented");
  }

  async updateService(
    serviceId: string,
    config: ServiceConfig,
  ): Promise<Service> {
    // TODO: Stop old container, create new one with updated config
    throw new Error("Not implemented");
  }

  async deleteService(serviceId: string): Promise<void> {
    // TODO: Stop and remove container
    throw new Error("Not implemented");
  }

  async getServiceStatus(serviceId: string): Promise<ServiceStatus> {
    // TODO: Inspect container and return status
    throw new Error("Not implemented");
  }

  async *getLogs(
    serviceId: string,
    options: LogOptions,
  ): AsyncIterable<string> {
    // TODO: Stream container logs
    throw new Error("Not implemented");
  }

  async rollback(
    serviceId: string,
    targetDeploymentId: string,
  ): Promise<Service> {
    // TODO: Start container from previous image tag
    throw new Error("Not implemented");
  }
}
