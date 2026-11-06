'use strict';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
let valid = false;
try {
  const url = new URL(dsn);
  valid = url.protocol === 'https:' && Boolean(url.username) && /^\/[0-9]+$/.test(url.pathname);
} catch {
  // Report the variable name only; never print the client key or supplied value.
}
if (!valid) {
  console.error('Docker builds require NEXT_PUBLIC_SENTRY_DSN as a valid HTTPS Sentry DSN with a client key and numeric project ID. Enable it at build time in the deployment configuration.');
  process.exitCode = 1;
}
