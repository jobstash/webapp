'use strict';

const { createServer } = require('node:http');
const { spawn } = require('node:child_process');

// Test/build fixtures only. Production builds continue to use the configured API.
const fixtures = new Map([
  ['/v2/search/sitemap/jobs', { data: [{ shortUUID: 'ci-fixture', title: 'Fixture Engineer', organizationName: 'Build Fixture', timestamp: 1793923200000 }] }],
  ['/v2/search/sitemap/pillars', { data: [{ slug: 'engineering', lastModified: '2026-11-06T00:00:00.000Z', jobCount: 20 }] }],
]);

const createFixtureServer = () => createServer((request, response) => {
  const fixture = request.method === 'GET' && fixtures.get(request.url);
  response.writeHead(fixture ? 200 : 404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(fixture || { error: 'Unknown build fixture' }));
});

module.exports = { createFixtureServer };

if (require.main === module) {
  const server = createFixtureServer();
  server.listen(18769, '127.0.0.1', () => {
    console.log('Build sitemap fixtures listening on 127.0.0.1:18769');
    if (!process.argv.includes('--build')) return;
    const child = spawn('pnpm', ['build'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_PUBLIC_MW_URL: 'http://127.0.0.1:18769',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    });
    child.on('error', () => {
      process.exitCode = 1;
      server.close();
    });
    child.on('exit', (code) => {
      process.exitCode = code ?? 1;
      server.close();
    });
  });
}
