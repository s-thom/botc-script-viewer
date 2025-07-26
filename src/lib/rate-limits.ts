import PQueue from "p-queue";

interface KeyedRateLimitOptions {
  /** How long the interval in the queue is. */
  intervalMs: number;
  /** How many tasks can run in the given interval. */
  intervalCap: number;
}

export class KeyedRateLimit<K> {
  private queueMap = new Map<K, PQueue>();
  private options: KeyedRateLimitOptions;

  constructor(options: KeyedRateLimitOptions) {
    this.options = options;
  }

  /**
   * Set up the cleanup of queues to release memory.
   */
  private setupCleanupQueue(key: K) {
    // As far as I can tell, all callbacks and memory references should be cleaned up after this.

    const queue = this.queueMap.get(key)!;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    queue.on("idle", () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }

      // Wait some amount of time before deleting queue, in case more requests come in during this time.
      timeout = setTimeout(() => {
        if (queue.size === 0 && queue.pending === 0) {
          this.queueMap.delete(key);
        }
      }, this.options.intervalMs * 5);
    });
  }

  enqueue<R>(key: K, callback: () => R): Promise<R> {
    if (!this.queueMap.has(key)) {
      const newQueue = new PQueue({
        interval: this.options.intervalMs,
        intervalCap: this.options.intervalCap,
      });
      this.queueMap.set(key, newQueue);
      this.setupCleanupQueue(key);
    }

    const queue = this.queueMap.get(key)!;
    return queue.add(callback, { throwOnTimeout: true });
  }
}
