import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VERSION, SELF_IP_URL, DEFAULT_PROVIDER, PROVIDER_NAMES } from '../src/config.js';

describe('config', () => {
  it('exports a semver VERSION string', () => {
    assert.match(VERSION, /^\d+\.\d+\.\d+$/);
  });

  it('exports SELF_IP_URL as a valid URL', () => {
    const url = new URL(SELF_IP_URL);
    assert.ok(url.protocol === 'https:');
  });

  it('DEFAULT_PROVIDER is included in PROVIDER_NAMES', () => {
    assert.ok(PROVIDER_NAMES.includes(DEFAULT_PROVIDER));
  });

  it('PROVIDER_NAMES contains all three providers', () => {
    assert.deepStrictEqual(PROVIDER_NAMES, ['ipinfo', 'ipapi', 'ip-api']);
  });
});
