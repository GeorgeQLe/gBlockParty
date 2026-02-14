import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("notifier");

export interface NotificationPayload {
  projectName: string;
  deploymentType: string;
  status: string;
  url?: string;
  errorMessage?: string;
}

export async function sendSlackNotification(
  webhookUrl: string,
  payload: NotificationPayload,
): Promise<void> {
  // TODO: Send Slack webhook message
  logger.info({ projectName: payload.projectName }, "Sending Slack notification");
  throw new Error("Not implemented");
}

export async function sendDiscordNotification(
  webhookUrl: string,
  payload: NotificationPayload,
): Promise<void> {
  // TODO: Send Discord webhook message
  logger.info({ projectName: payload.projectName }, "Sending Discord notification");
  throw new Error("Not implemented");
}

export async function notify(
  settings: { slackWebhookUrl?: string | null; discordWebhookUrl?: string | null },
  payload: NotificationPayload,
): Promise<void> {
  const promises: Promise<void>[] = [];

  if (settings.slackWebhookUrl) {
    promises.push(sendSlackNotification(settings.slackWebhookUrl, payload));
  }
  if (settings.discordWebhookUrl) {
    promises.push(sendDiscordNotification(settings.discordWebhookUrl, payload));
  }

  await Promise.allSettled(promises);
}
