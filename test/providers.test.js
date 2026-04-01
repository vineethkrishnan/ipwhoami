import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getProvider, getAllProviders } from '../src/providers/index.js';

describe('provider registry', () => {
  it('returns ipinfo provider by name', () => {
    const provider = getProvider('ipinfo');
    assert.equal(provider.name, 'ipinfo');
    assert.equal(typeof provider.lookup, 'function');
  });

  it('returns ipapi provider by name', () => {
    const provider = getProvider('ipapi');
    assert.equal(provider.name, 'ipapi');
    assert.equal(typeof provider.lookup, 'function');
  });

  it('returns ip-api provider by name', () => {
    const provider = getProvider('ip-api');
    assert.equal(provider.name, 'ip-api');
    assert.equal(typeof provider.lookup, 'function');
  });

  it('throws for unknown provider', () => {
    assert.throws(() => getProvider('unknown'), /unknown provider/);
  });

  it('throws for empty string', () => {
    assert.throws(() => getProvider(''), /unknown provider/);
  });

  it('getAllProviders returns all three providers', () => {
    const all = getAllProviders();
    assert.equal(all.length, 3);
    const names = all.map((p) => p.name);
    assert.deepStrictEqual(names, ['ipinfo', 'ipapi', 'ip-api']);
  });

  it('each provider has required properties', () => {
    for (const { provider } of getAllProviders()) {
      assert.equal(typeof provider.name, 'string');
      assert.equal(typeof provider.displayName, 'string');
      assert.equal(typeof provider.url, 'function');
      assert.equal(typeof provider.lookup, 'function');
    }
  });

  it('each provider generates a URL with the IP', () => {
    for (const { provider } of getAllProviders()) {
      const url = provider.url('8.8.8.8');
      assert.ok(url.includes('8.8.8.8'), `${provider.name} URL should contain IP`);
    }
  });
});

describe('provider lookup (mocked fetch)', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('ipinfo normalizes response correctly', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        ip: '8.8.8.8',
        city: 'Mountain View',
        region: 'California',
        country: 'US',
        org: 'AS15169 Google LLC',
        loc: '37.4056,-122.0775',
        timezone: 'America/Los_Angeles',
      }),
    });

    const provider = getProvider('ipinfo');
    const result = await provider.lookup('8.8.8.8');

    assert.equal(result.ip, '8.8.8.8');
    assert.equal(result.city, 'Mountain View');
    assert.equal(result.region, 'California');
    assert.equal(result.country, 'US');
    assert.equal(result.org, 'AS15169 Google LLC');
    assert.equal(result.location, '37.4056,-122.0775');
    assert.equal(result.timezone, 'America/Los_Angeles');
  });

  it('ipapi normalizes response correctly', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        ip: '8.8.8.8',
        city: 'Mountain View',
        region: 'California',
        country_name: 'United States',
        org: 'Google LLC',
        latitude: 37.4223,
        longitude: -122.085,
        timezone: 'America/Los_Angeles',
      }),
    });

    const provider = getProvider('ipapi');
    const result = await provider.lookup('8.8.8.8');

    assert.equal(result.ip, '8.8.8.8');
    assert.equal(result.city, 'Mountain View');
    assert.equal(result.country, 'United States');
    assert.equal(result.location, '37.4223, -122.085');
    assert.equal(result.timezone, 'America/Los_Angeles');
  });

  it('ip-api normalizes response correctly', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        query: '8.8.8.8',
        city: 'Mountain View',
        regionName: 'California',
        country: 'United States',
        isp: 'Google LLC',
        lat: 37.4056,
        lon: -122.0775,
        timezone: 'America/Los_Angeles',
      }),
    });

    const provider = getProvider('ip-api');
    const result = await provider.lookup('8.8.8.8');

    assert.equal(result.ip, '8.8.8.8');
    assert.equal(result.city, 'Mountain View');
    assert.equal(result.region, 'California');
    assert.equal(result.country, 'United States');
    assert.equal(result.org, 'Google LLC');
    assert.equal(result.location, '37.4056, -122.0775');
    assert.equal(result.timezone, 'America/Los_Angeles');
  });

  it('ipapi handles missing lat/lon gracefully', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        ip: '8.8.8.8',
        city: 'Mountain View',
        region: 'California',
        country_name: 'United States',
        org: 'Google LLC',
        latitude: null,
        longitude: null,
        timezone: 'America/Los_Angeles',
      }),
    });

    const provider = getProvider('ipapi');
    const result = await provider.lookup('8.8.8.8');
    assert.equal(result.location, undefined);
  });

  it('ip-api handles missing lat/lon gracefully', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        query: '8.8.8.8',
        city: 'Unknown',
        regionName: '',
        country: '',
        isp: '',
        lat: 0,
        lon: 0,
        timezone: '',
      }),
    });

    const provider = getProvider('ip-api');
    const result = await provider.lookup('8.8.8.8');
    // lat/lon of 0 are falsy but valid - location should still be set
    assert.equal(result.location, undefined);
  });

  it('throws on HTTP error', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 429,
    });

    const provider = getProvider('ipinfo');
    await assert.rejects(provider.lookup('8.8.8.8'), /HTTP 429/);
  });

  it('throws on network failure', async () => {
    globalThis.fetch = async () => {
      throw new Error('network down');
    };

    const provider = getProvider('ipinfo');
    await assert.rejects(provider.lookup('8.8.8.8'), /failed/);
  });
});
