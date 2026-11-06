'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
const { test } = require('node:test');

const script = join(__dirname, 'validate-browser-sentry.cjs');
const key = 'offline-fixture-client-key';
for (const value of [undefined, '', 'not-a-url', `http://${key}@sentry.invalid/123`, `https://sentry.invalid/123`, `https://${key}@sentry.invalid/not-a-project`]) {
  test(`rejects invalid browser DSN shape ${JSON.stringify(value?.replace(key, '[key]'))}`, () => {
    const env = { ...process.env };
    delete env.NEXT_PUBLIC_SENTRY_DSN;
    if (value !== undefined) env.NEXT_PUBLIC_SENTRY_DSN = value;
    const result = spawnSync(process.execPath, [script], { env, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /NEXT_PUBLIC_SENTRY_DSN/);
    assert.ok(!result.stderr.includes(key));
  });
}
test('accepts the public build-time DSN without printing its value', () => {
  const result = spawnSync(process.execPath, [script], {
    env: { ...process.env, NEXT_PUBLIC_SENTRY_DSN: `https://${key}@sentry.invalid/123` },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});
