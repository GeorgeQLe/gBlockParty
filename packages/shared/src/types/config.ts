import type { Framework } from "./project";

export interface HealthCheckConfig {
  path: string;
}

export interface ResourceConfig {
  cpu: number;
  memory: number;
}

export interface ServiceConfig {
  type: Framework;
  path?: string;
  dockerfile?: string;
  port: number;
  resources?: ResourceConfig;
  healthCheck?: HealthCheckConfig;
}

export interface DeployConfig {
  name: string;
  type?: Framework;
  port?: number;
  dockerfile?: string;
  resources?: ResourceConfig;
  healthCheck?: HealthCheckConfig;
  services?: Record<string, ServiceConfig>;
}

export interface FrameworkConfig {
  name: string;
  buildCommand: string;
  outputDir: string;
  devCommand: string;
}
