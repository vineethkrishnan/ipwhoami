import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateIP } from '../src/ip.js';

describe('validateIP', () => {
  it('accepts a valid IPv4 address', () => {
    assert.ok(validateIP('8.8.8.8'));
  });

  it('accepts another valid IPv4 address', () => {
    assert.ok(validateIP('192.168.1.1'));
  });

  it('accepts 0.0.0.0', () => {
    assert.ok(validateIP('0.0.0.0'));
  });

  it('accepts 255.255.255.255', () => {
    assert.ok(validateIP('255.255.255.255'));
  });

  it('accepts a valid IPv6 address', () => {
    assert.ok(validateIP('2001:4860:4860::8888'));
  });

  it('accepts a short IPv6 address', () => {
    assert.ok(validateIP('::1'));
  });

  it('accepts a full IPv6 address', () => {
    assert.ok(validateIP('fe80:0000:0000:0000:0000:0000:0000:0001'));
  });

  it('rejects a hostname', () => {
    assert.throws(() => validateIP('google.com'), /invalid IP address/);
  });

  it('rejects a random string', () => {
    assert.throws(() => validateIP('not-an-ip'), /invalid IP address/);
  });

  it('rejects an empty string', () => {
    assert.throws(() => validateIP(''), /invalid IP address/);
  });

  it('rejects an IP with too few octets', () => {
    assert.throws(() => validateIP('8.8.8'), /invalid IP address/);
  });

  it('rejects an IP with letters', () => {
    assert.throws(() => validateIP('8.8.8.abc'), /invalid IP address/);
  });
});
