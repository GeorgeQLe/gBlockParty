import type { Database } from "@gblockparty/shared/db";
import type { WebhookPayload } from "@gblockparty/shared/types";
import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("github-webhooks");

export interface WebhookContext {
  db: Database;
  payload: WebhookPayload;
  event: string;
  deliveryId: string;
}

export async function handleWebhook(ctx: WebhookContext): Promise<void> {
  const { event, payload, deliveryId } = ctx;

  logger.info({ event, deliveryId }, "Processing webhook");

  switch (event) {
    case "push":
      // TODO: Handle push to production branch → trigger production deployment
      break;
    case "pull_request":
      // TODO: Handle PR opened/synchronize → preview deployment
      // TODO: Handle PR closed/merged → cleanup preview
      break;
    case "installation":
      // TODO: Handle app installation/uninstallation
      break;
    default:
      logger.debug({ event }, "Unhandled webhook event");
  }
}
