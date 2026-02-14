export type EnvScope = "production" | "preview";

export interface EnvVar {
  id: string;
  projectId: string;
  scope: EnvScope;
  key: string;
  value: string;
  isSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}
