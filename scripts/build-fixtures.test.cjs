'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { once } = require('node:events');
const { createFixtureServer } = require('./build-fixtures.cjs');

test('build fixtures serve only explicit sitemap GET contracts', async () => {
  const server = createFixtureServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const jobs = await fetch(`${origin}/v2/search/sitemap/jobs`);
    assert.equal(jobs.status, 200);
    assert.equal((await jobs.json()).data[0].shortUUID, 'ci-fixture');
    const pillars = await fetch(`${origin}/v2/search/sitemap/pillars`);
    assert.equal(pillars.status, 200);
    assert.equal((await pillars.json()).data[0].jobCount, 20);
    assert.equal((await fetch(`${origin}/profile/info`)).status, 404);
    assert.equal((await fetch(`${origin}/v2/search/sitemap/jobs`, { method: 'POST' })).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
