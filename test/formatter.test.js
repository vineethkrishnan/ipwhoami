import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatResult, formatRaw, formatCompareHeader } from '../src/formatter.js';

describe('formatResult', () => {
  const mockResult = {
    ip: '8.8.8.8',
    city: 'Mountain View',
    region: 'California',
    country: 'US',
    org: 'Google LLC',
    location: '37.4056,-122.0775',
    timezone: 'America/Los_Angeles',
  };

  it('includes the provider name in the header', () => {
    const output = formatResult('ipinfo', mockResult);
    assert.ok(output.includes('ipinfo'));
  });

  it('includes all field values', () => {
    const output = formatResult('ipinfo', mockResult);
    assert.ok(output.includes('8.8.8.8'));
    assert.ok(output.includes('Mountain View'));
    assert.ok(output.includes('California'));
    assert.ok(output.includes('US'));
    assert.ok(output.includes('Google LLC'));
    assert.ok(output.includes('37.4056,-122.0775'));
    assert.ok(output.includes('America/Los_Angeles'));
  });

  it('shows n/a for missing fields', () => {
    const partial = { ip: '1.1.1.1' };
    const output = formatResult('test', partial);
    assert.ok(output.includes('n/a'));
    assert.ok(output.includes('1.1.1.1'));
  });

  it('shows n/a for undefined fields', () => {
    const result = {
      ip: '1.1.1.1',
      city: undefined,
      region: undefined,
      country: undefined,
      org: undefined,
      location: undefined,
      timezone: undefined,
    };
    const output = formatResult('test', result);
    const naCount = (output.match(/n\/a/g) || []).length;
    assert.equal(naCount, 6); // all except ip
  });
});

describe('formatRaw', () => {
  it('returns valid JSON', () => {
    const result = { ip: '8.8.8.8', city: 'Test' };
    const output = formatRaw(result);
    const parsed = JSON.parse(output);
    assert.deepStrictEqual(parsed, result);
  });

  it('is pretty-printed with 2-space indent', () => {
    const result = { ip: '8.8.8.8' };
    const output = formatRaw(result);
    assert.equal(output, JSON.stringify(result, null, 2));
  });

  it('handles all fields', () => {
    const result = {
      ip: '1.1.1.1',
      city: 'San Francisco',
      region: 'California',
      country: 'US',
      org: 'Cloudflare',
      location: '37.7749,-122.4194',
      timezone: 'America/Los_Angeles',
    };
    const parsed = JSON.parse(formatRaw(result));
    assert.equal(Object.keys(parsed).length, 7);
  });
});

describe('formatCompareHeader', () => {
  it('includes the IP address', () => {
    const output = formatCompareHeader('8.8.8.8');
    assert.ok(output.includes('8.8.8.8'));
  });

  it('includes a separator line', () => {
    const output = formatCompareHeader('1.1.1.1');
    // The separator uses Unicode box-drawing char
    assert.ok(output.includes('\u2500'));
  });
});
