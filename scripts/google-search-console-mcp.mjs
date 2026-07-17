#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const credentialsPath =
  process.env.GSC_OAUTH_CLIENT_FILE ??
  join(projectRoot, '.gsc', 'google-oauth-client.local.json');
const connectorExecutable =
  process.env.GSC_MCP_EXECUTABLE ??
  join(homedir(), '.local', 'bin', 'flin-google-search-console-mcp');

const childEnv = { ...process.env };
childEnv.GOOGLE_SEARCH_CONSOLE_SITE_URL ??= 'sc-domain:jobstash.xyz';

if (existsSync(credentialsPath)) {
  try {
    const parsed = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    const credentials = parsed.installed ?? parsed.web ?? parsed;
    const clientId = credentials.client_id;
    const clientSecret = credentials.client_secret;

    if (typeof clientId !== 'string' || typeof clientSecret !== 'string') {
      throw new Error(
        'expected an OAuth Desktop app JSON containing installed.client_id and installed.client_secret',
      );
    }

    childEnv.GOOGLE_CLIENT_ID = clientId;
    childEnv.GOOGLE_CLIENT_SECRET = clientSecret;
  } catch (error) {
    console.error(
      `Google Search Console MCP could not read ${credentialsPath}: ${error.message}`,
    );
    process.exit(1);
  }
} else if (!childEnv.GOOGLE_CLIENT_ID || !childEnv.GOOGLE_CLIENT_SECRET) {
  console.error(
    `Google Search Console OAuth client not found at ${credentialsPath}. ` +
      'The health_check tool will explain the missing configuration.',
  );
}

const child = spawn(connectorExecutable, [], {
  env: childEnv,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(
    `Google Search Console MCP failed to start ${connectorExecutable}: ${error.message}`,
  );
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 0));

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    child.kill(signal);
    setTimeout(() => process.exit(0), 1_000).unref();
  });
}
