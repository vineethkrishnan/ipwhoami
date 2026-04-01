import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidIP, extractClientIP } from '../src/ip.js';

describe('isValidIP', () => {
  it('accepts valid IPv4', () => {
    assert.ok(isValidIP('8.8.8.8'));
    assert.ok(isValidIP('192.168.1.1'));
    assert.ok(isValidIP('0.0.0.0'));
    assert.ok(isValidIP('255.255.255.255'));
  });

  it('accepts valid IPv6', () => {
    assert.ok(isValidIP('2001:4860:4860::8888'));
    assert.ok(isValidIP('::1'));
    assert.ok(isValidIP('fe80::1'));
  });

  it('rejects invalid input', () => {
    assert.ok(!isValidIP(''));
    assert.ok(!isValidIP(null));
    assert.ok(!isValidIP(undefined));
    assert.ok(!isValidIP('google.com'));
    assert.ok(!isValidIP('not-an-ip'));
    assert.ok(!isValidIP('8.8.8'));
  });
});

describe('extractClientIP', () => {
  function mockContext(headers = {}, remoteAddress = null) {
    return {
      req: {
        header: (name) => headers[name.toLowerCase()] || null,
      },
      env: remoteAddress ? { incoming: { socket: { remoteAddress } } } : {},
    };
  }

  it('extracts from CF-Connecting-IP', () => {
    const c = mockContext({ 'cf-connecting-ip': '1.2.3.4' });
    assert.equal(extractClientIP(c), '1.2.3.4');
  });

  it('extracts first IP from X-Forwarded-For', () => {
    const c = mockContext({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
    assert.equal(extractClientIP(c), '1.2.3.4');
  });

  it('extracts from X-Real-IP', () => {
    const c = mockContext({ 'x-real-ip': '10.0.0.1' });
    assert.equal(extractClientIP(c), '10.0.0.1');
  });

  it('extracts from Fly-Client-IP', () => {
    const c = mockContext({ 'fly-client-ip': '9.9.9.9' });
    assert.equal(extractClientIP(c), '9.9.9.9');
  });

  it('falls back to socket remoteAddress', () => {
    const c = mockContext({}, '192.168.0.1');
    assert.equal(extractClientIP(c), '192.168.0.1');
  });

  it('strips ::ffff: prefix from IPv4-mapped IPv6', () => {
    const c = mockContext({}, '::ffff:127.0.0.1');
    assert.equal(extractClientIP(c), '127.0.0.1');
  });

  it('prioritizes CF-Connecting-IP over X-Forwarded-For', () => {
    const c = mockContext({
      'cf-connecting-ip': '1.1.1.1',
      'x-forwarded-for': '2.2.2.2',
    });
    assert.equal(extractClientIP(c), '1.1.1.1');
  });

  it('returns null when no IP available', () => {
    const c = mockContext();
    assert.equal(extractClientIP(c), null);
  });

  it('trims whitespace', () => {
    const c = mockContext({ 'x-real-ip': '  8.8.8.8  ' });
    assert.equal(extractClientIP(c), '8.8.8.8');
  });
});
