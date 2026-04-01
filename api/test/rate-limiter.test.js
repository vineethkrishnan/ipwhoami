import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../src/rate-limiter.js';

describe('rate limiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 5,
      banThresholdMultiplier: 3,
      banDurationMs: 5000,
      cleanupIntervalMs: 500,
    });
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < 5; i++) {
      const result = limiter.check('1.2.3.4');
      assert.ok(result.allowed);
    }
  });

  it('tracks remaining count correctly', () => {
    assert.equal(limiter.check('1.1.1.1').remaining, 4);
    assert.equal(limiter.check('1.1.1.1').remaining, 3);
    assert.equal(limiter.check('1.1.1.1').remaining, 2);
  });

  it('rejects when rate limit exceeded', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('1.2.3.4');
    }
    const result = limiter.check('1.2.3.4');
    assert.ok(!result.allowed);
    assert.equal(result.remaining, 0);
    assert.ok(result.retryAfterMs > 0);
    assert.ok(!result.banned);
  });

  it('bans IP when abuse threshold exceeded', () => {
    // 5 max * 3 multiplier = 15 requests triggers ban
    for (let i = 0; i < 15; i++) {
      limiter.check('abuser');
    }
    const result = limiter.check('abuser');
    assert.ok(!result.allowed);
    assert.ok(result.banned);
    assert.ok(result.retryAfterMs >= 4000);
  });

  it('tracks separate IPs independently', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('ip-a');
    }
    const resultA = limiter.check('ip-a');
    const resultB = limiter.check('ip-b');

    assert.ok(!resultA.allowed);
    assert.ok(resultB.allowed);
  });

  it('reports stats correctly', () => {
    limiter.check('a');
    limiter.check('b');
    const stats = limiter.getStats();
    assert.equal(stats.totalTracked, 2);
    assert.equal(stats.totalBanned, 0);
  });

  it('reports banned count in stats', () => {
    for (let i = 0; i < 16; i++) {
      limiter.check('bad-actor');
    }
    const stats = limiter.getStats();
    assert.equal(stats.totalBanned, 1);
  });

  it('reset clears all state', () => {
    limiter.check('1.1.1.1');
    limiter.reset();
    const stats = limiter.getStats();
    assert.equal(stats.totalTracked, 0);
  });
});
