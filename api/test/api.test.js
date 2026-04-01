import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const hasDB = existsSync(join(DATA_DIR, 'dbip-city-lite.mmdb'));

describe('API integration', { skip: !hasDB && 'MMDB files not found — run npm run download-db' }, () => {
  let app;

  before(async () => {
    const { loadDatabases } = await import('../src/db.js');
    await loadDatabases();

    const { Hono } = await import('hono');
    const { isValidIP, extractClientIP } = await import('../src/ip.js');
    const { normalizeResult } = await import('../src/response.js');
    const { lookupCity, lookupASN, getDatabaseMeta } = await import('../src/db.js');

    app = new Hono();

    app.get('/lookup/:ip', async (c) => {
      const ip = c.req.param('ip');
      if (!isValidIP(ip)) return c.json({ error: `invalid IP address: ${ip}` }, 400);
      const cityResult = lookupCity(ip);
      const asnResult = lookupASN(ip);
      if (!cityResult) return c.json({ error: `no geolocation data found for ${ip}` }, 404);
      return c.json(normalizeResult(ip, cityResult, asnResult));
    });

    app.get('/health', async (c) => {
      const meta = await getDatabaseMeta();
      return c.json({ status: meta.loaded ? 'ok' : 'degraded', db_version: meta.dbDate });
    });
  });

  it('GET /lookup/8.8.8.8 returns geolocation', async () => {
    const res = await app.request('/lookup/8.8.8.8');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ip, '8.8.8.8');
    assert.equal(body.provider, 'ipwhoami');
    assert.ok(body.country);
  });

  it('GET /lookup/1.1.1.1 returns geolocation', async () => {
    const res = await app.request('/lookup/1.1.1.1');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ip, '1.1.1.1');
    assert.ok(body.city || body.country);
  });

  it('GET /lookup/invalid returns 400', async () => {
    const res = await app.request('/lookup/not-an-ip');
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes('invalid'));
  });

  it('GET /health returns ok', async () => {
    const res = await app.request('/health');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.ok(body.db_version);
  });

  it('response has all expected fields', async () => {
    const res = await app.request('/lookup/8.8.8.8');
    const body = await res.json();
    const expectedFields = ['ip', 'city', 'region', 'country', 'country_name', 'org', 'location', 'timezone', 'provider'];
    for (const field of expectedFields) {
      assert.ok(field in body, `missing field: ${field}`);
    }
  });

  it('IPv6 lookup works', async () => {
    const res = await app.request('/lookup/2001:4860:4860::8888');
    // May return 200 or 404 depending on DB coverage, but should not 500
    assert.ok([200, 404].includes(res.status));
  });
});
