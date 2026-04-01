import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { loadDatabases, lookupCity, lookupASN, getDatabaseMeta } from './db.js';
import { isValidIP, extractClientIP } from './ip.js';
import { normalizeResult } from './response.js';
import { createRateLimiter, rateLimitMiddleware } from './rate-limiter.js';

const app = new Hono();
const limiter = createRateLimiter();

// Middleware
app.use('*', cors());
app.use('/lookup/*', rateLimitMiddleware(limiter, extractClientIP));
app.use('/lookup', rateLimitMiddleware(limiter, extractClientIP));

// Lookup specific IP
app.get('/lookup/:ip', async (c) => {
  const ip = c.req.param('ip');

  if (!isValidIP(ip)) {
    return c.json({ error: `invalid IP address: ${ip}` }, 400);
  }

  const cityResult = lookupCity(ip);
  const asnResult = lookupASN(ip);

  if (!cityResult) {
    return c.json({ error: `no geolocation data found for ${ip}` }, 404);
  }

  const meta = await getDatabaseMeta();
  c.header('X-Database-Date', meta.dbDate || 'unknown');
  c.header('X-Powered-By', 'ipwhoami');

  return c.json(normalizeResult(ip, cityResult, asnResult));
});

// Lookup caller's IP (auto-detect)
app.get('/lookup', async (c) => {
  const ip = extractClientIP(c);

  if (!ip) {
    return c.json({ error: 'could not determine your IP address' }, 400);
  }

  const cityResult = lookupCity(ip);
  const asnResult = lookupASN(ip);

  if (!cityResult) {
    return c.json({ error: `no geolocation data found for ${ip}` }, 404);
  }

  const meta = await getDatabaseMeta();
  c.header('X-Database-Date', meta.dbDate || 'unknown');
  c.header('X-Powered-By', 'ipwhoami');

  return c.json(normalizeResult(ip, cityResult, asnResult));
});

// Health check
app.get('/health', async (c) => {
  const meta = await getDatabaseMeta();
  const rateLimitStats = limiter.getStats();

  if (!meta.loaded) {
    return c.json({
      status: 'degraded',
      error: 'databases not loaded',
      ...rateLimitStats,
    }, 503);
  }

  return c.json({
    status: 'ok',
    db_version: meta.dbDate,
    db_age_hours: meta.dbAgeHours,
    loaded_at: meta.loadedAt?.toISOString(),
    ...rateLimitStats,
  });
});

// Root
app.get('/', (c) => {
  return c.json({
    name: 'ipwhoami-api',
    version: '1.0.0',
    endpoints: {
      lookup_ip: 'GET /lookup/:ip',
      lookup_self: 'GET /lookup',
      health: 'GET /health',
    },
    source: 'https://github.com/vineethkrishnan/ipwhoami',
    attribution: 'IP geolocation by DB-IP (https://db-ip.com)',
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);

try {
  await loadDatabases();
  console.log('Databases loaded successfully');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`ipwhoami-api listening on http://localhost:${PORT}`);
});

export { app };
