import * as Sentry from '@sentry/node';

import { serverEnv } from '@/lib/env/server';

export const POST = async (): Promise<Response> => {
  const testError = new Error(
    `[Sentry Test] Server error at ${new Date().toISOString()}`,
  );
  testError.name = 'SentryServerTestError';

  if (!serverEnv.SENTRY_DSN) {
    return Response.json({
      status: 'no_dsn',
      message: 'SENTRY_DSN is not set. Errors would only go to console.error.',
    });
  }

  Sentry.captureException(testError);

  // Flush to ensure the event is sent before the response completes
  await Sentry.flush(2000);

  return Response.json({
    status: 'sent',
    message: 'Error captured and flushed to Sentry. Check your dashboard.',
    dsn_host: new URL(serverEnv.SENTRY_DSN).hostname,
  });
};
