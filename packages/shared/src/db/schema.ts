import {
  pgTable,
  uuid,
  text,
  bigint,
  integer,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  githubInstallationId: bigint("github_installation_id", { mode: "number" }),
  githubRepoFullName: text("github_repo_full_name").unique(),
  framework: text("framework"),
  nextMode: text("next_mode"),
  buildCommand: text("build_command"),
  outputDir: text("output_dir"),
  productionBranch: text("production_branch").default("main").notNull(),
  productionDeploymentId: uuid("production_deployment_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const deployments = pgTable(
  "deployments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(),
    status: text("status").default("queued").notNull(),
    commitSha: text("commit_sha"),
    branch: text("branch"),
    prNumber: integer("pr_number"),
    dockerImageTag: text("docker_image_tag"),
    containerId: text("container_id"),
    port: integer("port"),
    url: text("url"),
    buildDurationMs: integer("build_duration_ms"),
    buildLogS3Key: text("build_log_s3_key"),
    errorMessage: text("error_message"),
    sourceDeploymentId: uuid("source_deployment_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_deployments_project_created").on(
      table.projectId,
      table.createdAt,
    ),
    index("idx_deployments_status").on(table.status),
  ],
);

export const envVars = pgTable(
  "env_vars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    scope: text("scope").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    isSecret: boolean("is_secret").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_env_vars_project_scope").on(table.projectId, table.scope),
    unique("env_vars_project_scope_key").on(
      table.projectId,
      table.scope,
      table.key,
    ),
  ],
);

export const managedDatabases = pgTable("managed_databases", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  dbName: text("db_name").unique().notNull(),
  dbUser: text("db_user").notNull(),
  dbPasswordEncrypted: text("db_password_encrypted").notNull(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const githubInstallations = pgTable("github_installations", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  githubAccountLogin: text("github_account_login").notNull(),
  githubAccountType: text("github_account_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const portAllocations = pgTable(
  "port_allocations",
  {
    port: integer("port").primaryKey(),
    deploymentId: uuid("deployment_id")
      .references(() => deployments.id, { onDelete: "cascade" })
      .notNull(),
    allocatedAt: timestamp("allocated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_port_allocations_deployment").on(table.deploymentId),
  ],
);

export const notificationSettings = pgTable("notification_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  slackWebhookUrl: text("slack_webhook_url"),
  discordWebhookUrl: text("discord_webhook_url"),
  notifyOnFailure: boolean("notify_on_failure").default(true).notNull(),
  notifyOnRollback: boolean("notify_on_rollback").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
