export interface ServiceConfig {
  image: string;
  port: number;
  envVars: Record<string, string>;
  name: string;
  healthCheckPath: string;
  memoryMb?: number;
  cpuUnits?: number;
}

export interface Service {
  id: string;
  containerId: string;
  port: number;
  status: ServiceStatus;
}

export type ServiceStatus = "running" | "stopped" | "starting" | "failed" | "unknown";

export interface LogOptions {
  since?: Date;
  tail?: number;
  follow?: boolean;
}

export interface DeploymentProvider {
  createService(config: ServiceConfig): Promise<Service>;
  updateService(serviceId: string, config: ServiceConfig): Promise<Service>;
  deleteService(serviceId: string): Promise<void>;
  getServiceStatus(serviceId: string): Promise<ServiceStatus>;
  getLogs(serviceId: string, options: LogOptions): AsyncIterable<string>;
  rollback(serviceId: string, targetDeploymentId: string): Promise<Service>;
}
