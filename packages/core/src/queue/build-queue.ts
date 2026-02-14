import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("build-queue");

interface QueueItem {
  id: string;
  projectId: string;
  execute: () => Promise<void>;
  cancel?: () => void;
}

export class BuildQueue {
  private queue: QueueItem[] = [];
  private running: QueueItem | null = null;

  async enqueue(item: QueueItem): Promise<void> {
    // Cancel-and-replace: remove existing items for the same project
    this.queue = this.queue.filter((q) => {
      if (q.projectId === item.projectId) {
        logger.info(
          { projectId: item.projectId, replacedId: q.id },
          "Replacing queued build",
        );
        q.cancel?.();
        return false;
      }
      return true;
    });

    this.queue.push(item);
    logger.info(
      { id: item.id, projectId: item.projectId, queueLength: this.queue.length },
      "Build enqueued",
    );

    if (!this.running) {
      await this.processNext();
    }
  }

  private async processNext(): Promise<void> {
    const next = this.queue.shift();
    if (!next) {
      this.running = null;
      return;
    }

    this.running = next;
    try {
      await next.execute();
    } catch (err) {
      logger.error({ id: next.id, err }, "Build failed");
    } finally {
      this.running = null;
      await this.processNext();
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isRunning(): boolean {
    return this.running !== null;
  }
}
