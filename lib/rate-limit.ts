const cache = new Map<string, { count: number; resetAt: number }>();

export function checkDailyLimit(key: string, max = 200) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const item = cache.get(key);
  if (!item || item.resetAt < now) {
    cache.set(key, { count: 1, resetAt: now + day });
    return { ok: true, remaining: max - 1 };
  }

  if (item.count >= max) {
    return { ok: false, remaining: 0 };
  }

  item.count += 1;
  cache.set(key, item);
  return { ok: true, remaining: max - item.count };
}

export function randomDelayMs(minSeconds = 3, maxSeconds = 5) {
  const min = minSeconds * 1000;
  const max = maxSeconds * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
