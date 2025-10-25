export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((res, rej) => {
    const handle = setTimeout(res, ms);
    signal?.addEventListener("abort", (e) => {
      clearTimeout(handle);
      rej(e);
    });
  });
}

function idle(callback: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const handle = requestIdleCallback(callback, { timeout: 1000 });
    return () => cancelIdleCallback(handle);
  } else {
    const handle = setTimeout(callback, 0);
    return () => clearTimeout(handle);
  }
}

export function scheduleTask<T>(
  task: () => T,
  signal: AbortSignal
): Promise<T> {
  return new Promise<T>((res, rej) => {
    const cancel = idle(async () => {
      try {
        res(await task());
      } catch (err) {
        rej(err);
      }
    });

    signal.addEventListener("abort", cancel);
  });
}
