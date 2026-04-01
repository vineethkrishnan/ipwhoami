import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = join(__dirname, '..', 'bin', 'ipwho.js');

function runCLI(args = []) {
  return exec('node', [CLI, ...args], { timeout: 10000 });
}

describe('CLI integration', () => {
  describe('--help', () => {
    it('prints usage information', async () => {
      const { stdout } = await runCLI(['--help']);
      assert.ok(stdout.includes('ipwho'));
      assert.ok(stdout.includes('USAGE'));
      assert.ok(stdout.includes('OPTIONS'));
      assert.ok(stdout.includes('EXAMPLES'));
    });

    it('shows all provider names', async () => {
      const { stdout } = await runCLI(['--help']);
      assert.ok(stdout.includes('ipinfo'));
      assert.ok(stdout.includes('ipapi'));
      assert.ok(stdout.includes('ip-api'));
    });

    it('shows all flags', async () => {
      const { stdout } = await runCLI(['--help']);
      assert.ok(stdout.includes('--provider'));
      assert.ok(stdout.includes('--compare'));
      assert.ok(stdout.includes('--raw'));
      assert.ok(stdout.includes('--help'));
      assert.ok(stdout.includes('--version'));
    });

    it('works with short flag -h', async () => {
      const { stdout } = await runCLI(['-h']);
      assert.ok(stdout.includes('USAGE'));
    });

    it('exits with code 0', async () => {
      // If exec doesn't throw, exit code is 0
      await runCLI(['--help']);
    });
  });

  describe('--version', () => {
    it('prints version string', async () => {
      const { stdout } = await runCLI(['--version']);
      assert.match(stdout.trim(), /^ipwho \d+\.\d+\.\d+$/);
    });

    it('works with short flag -v', async () => {
      const { stdout } = await runCLI(['-v']);
      assert.match(stdout.trim(), /^ipwho \d+\.\d+\.\d+$/);
    });
  });

  describe('error handling', () => {
    it('rejects unknown flags', async () => {
      await assert.rejects(runCLI(['--unknown']), (err) => {
        assert.ok(err.stderr.includes('error:'));
        assert.ok(err.stderr.includes('unknown'));
        return true;
      });
    });

    it('rejects invalid IP address', async () => {
      await assert.rejects(runCLI(['not-an-ip']), (err) => {
        assert.ok(err.stderr.includes('error:'));
        assert.ok(err.stderr.includes('invalid IP'));
        return true;
      });
    });

    it('rejects unknown provider', async () => {
      await assert.rejects(runCLI(['-p', 'badprovider', '8.8.8.8']), (err) => {
        assert.ok(err.stderr.includes('error:'));
        assert.ok(err.stderr.includes('unknown provider'));
        return true;
      });
    });

    it('rejects --provider without value', async () => {
      await assert.rejects(runCLI(['--provider']), (err) => {
        assert.ok(err.stderr.includes('error:'));
        return true;
      });
    });
  });

  describe('lookup (live network)', () => {
    it('looks up 8.8.8.8 with default provider', async () => {
      const { stdout } = await runCLI(['8.8.8.8']);
      assert.ok(stdout.includes('8.8.8.8'));
      assert.ok(stdout.includes('ipinfo'));
    });

    it('looks up 8.8.8.8 with raw output', async () => {
      const { stdout } = await runCLI(['-r', '8.8.8.8']);
      const json = JSON.parse(stdout);
      assert.equal(json.ip, '8.8.8.8');
      assert.ok(json.city);
      assert.ok(json.timezone);
    });

    it('raw output is valid JSON with all expected fields', async () => {
      const { stdout } = await runCLI(['-r', '8.8.8.8']);
      const json = JSON.parse(stdout);
      const expectedFields = ['ip', 'city', 'region', 'country', 'org', 'location', 'timezone'];
      for (const field of expectedFields) {
        assert.ok(field in json, `missing field: ${field}`);
      }
    });

    it('looks up with ipapi provider', async () => {
      const { stdout } = await runCLI(['-p', 'ip-api', '8.8.8.8']);
      assert.ok(stdout.includes('8.8.8.8'));
      assert.ok(stdout.includes('ip-api'));
    });
  });
});
