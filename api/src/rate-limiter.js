// In-memory sliding window rate limiter with abuse detection

const DEFAULT_CONFIG = {
  windowMs: 60_000,        // 1 minute window
  maxRequests: 100,         // max requests per window per IP
  banThresholdMultiplier: 3, // ban if exceeding limit by 3x in a window
  banDurationMs: 600_000,   // 10 minute ban
  cleanupIntervalMs: 30_000, // cleanup stale entries every 30s
};

export function createRateLimiter(config = {}) {
  const opts = { ...DEFAULT_CONFIG, ...config };

  // ip -> { timestamps: number[], bannedUntil: number | null }
  const store = new Map();
  let lastCleanup = Date.now();

  function cleanup(now) {
    if (now - lastCleanup < opts.cleanupIntervalMs) return;
    lastCleanup = now;

    const cutoff = now - opts.windowMs;
    for (const [ip, entry] of store) {
      // Remove expired bans and stale windows
      if (entry.bannedUntil && entry.bannedUntil < now) {
        entry.bannedUntil = null;
      }
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
      if (entry.timestamps.length === 0 && !entry.bannedUntil) {
        store.delete(ip);
      }
    }
  }

  function getEntry(ip) {
    if (!store.has(ip)) {
      store.set(ip, { timestamps: [], bannedUntil: null });
    }
    return store.get(ip);
  }

  // Returns { allowed: boolean, remaining: number, retryAfterMs: number | null }
  function check(ip) {
    const now = Date.now();
    cleanup(now);

    const entry = getEntry(ip);

    // Check ban
    if (entry.bannedUntil) {
      if (now < entry.bannedUntil) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: entry.bannedUntil - now,
          banned: true,
        };
      }
      entry.bannedUntil = null;
    }

    // Slide window
    const cutoff = now - opts.windowMs;
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

    // Always record the attempt (needed for abuse detection)
    entry.timestamps.push(now);

    // Check rate
    if (entry.timestamps.length > opts.maxRequests) {
      // Check for abuse (excessive overshoot -> ban)
      if (entry.timestamps.length >= opts.maxRequests * opts.banThresholdMultiplier) {
        entry.bannedUntil = now + opts.banDurationMs;
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: opts.banDurationMs,
          banned: true,
        };
      }

      const oldestInWindow = entry.timestamps[0];
      const retryAfterMs = oldestInWindow + opts.windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(retryAfterMs, 1000),
        banned: false,
      };
    }
    return {
      allowed: true,
      remaining: opts.maxRequests - entry.timestamps.length,
      retryAfterMs: null,
      banned: false,
    };
  }

  function getStats() {
    let totalTracked = 0;
    let totalBanned = 0;
    const now = Date.now();
    for (const entry of store.values()) {
      totalTracked++;
      if (entry.bannedUntil && entry.bannedUntil > now) totalBanned++;
    }
    return { totalTracked, totalBanned };
  }

  // Reset for testing
  function reset() {
    store.clear();
  }

  return { check, getStats, reset };
}

// Hono middleware factory
export function rateLimitMiddleware(limiter, extractIP) {
  return async (c, next) => {
    const ip = extractIP(c) || 'unknown';
    const result = limiter.check(ip);

    c.header('X-RateLimit-Limit', '100');
    c.header('X-RateLimit-Remaining', String(result.remaining));

    if (!result.allowed) {
      const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);
      c.header('Retry-After', String(retryAfterSec));

      const message = result.banned
        ? 'Too many requests. You have been temporarily banned.'
        : 'Rate limit exceeded. Please slow down.';

      return c.json({ error: message }, 429);
    }

    await next();
  };
}
