export type Framework = "nextjs" | "dockerfile" | "static";
export type NextMode = "static" | "server";

export interface Project {
  id: string;
  name: string;
  slug: string;
  githubInstallationId: number | null;
  githubRepoFullName: string | null;
  framework: Framework | null;
  nextMode: NextMode | null;
  buildCommand: string | null;
  outputDir: string | null;
  productionBranch: string;
  productionDeploymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  framework: Framework | null;
  nextMode: NextMode | null;
  buildCommand: string | null;
  outputDir: string | null;
  productionBranch: string;
}
