import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('colors', () => {
  it('exports all color functions', async () => {
    const colors = await import('../src/colors.js');
    assert.equal(typeof colors.bold, 'function');
    assert.equal(typeof colors.dim, 'function');
    assert.equal(typeof colors.cyan, 'function');
    assert.equal(typeof colors.green, 'function');
    assert.equal(typeof colors.red, 'function');
  });

  it('each color function returns a string', async () => {
    const colors = await import('../src/colors.js');
    assert.equal(typeof colors.bold('test'), 'string');
    assert.equal(typeof colors.dim('test'), 'string');
    assert.equal(typeof colors.cyan('test'), 'string');
    assert.equal(typeof colors.green('test'), 'string');
    assert.equal(typeof colors.red('test'), 'string');
  });

  it('each color function includes the input text', async () => {
    const colors = await import('../src/colors.js');
    assert.ok(colors.bold('hello').includes('hello'));
    assert.ok(colors.dim('hello').includes('hello'));
    assert.ok(colors.cyan('hello').includes('hello'));
    assert.ok(colors.green('hello').includes('hello'));
    assert.ok(colors.red('hello').includes('hello'));
  });
});
