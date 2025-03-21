// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  breadcrumbsIntegration,
  browserApiErrorsIntegration,
  BrowserClient,
  dedupeIntegration,
  defaultStackParser,
  getCurrentScope,
  globalHandlersIntegration,
  httpClientIntegration,
  httpContextIntegration,
  inboundFiltersIntegration,
  linkedErrorsIntegration,
  makeFetchTransport,
} from '@sentry/nextjs';

const client = new BrowserClient({
  dsn: 'https://d9c07cf404c1777bcf744cb901dfc7c2@o4504495959703552.ingest.us.sentry.io/4508628441366528',
  tunnel: '/sentry-tunnel',
  tracesSampleRate: 1,
  debug: false,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: [
    inboundFiltersIntegration(),
    breadcrumbsIntegration(),
    globalHandlersIntegration(),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    browserApiErrorsIntegration(),
    httpClientIntegration(),
    httpContextIntegration(),
  ],

  denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i],
  beforeSend(event) {
    const hasStackTrace = event?.exception?.values?.some(
      (exceptionValue) => exceptionValue.stacktrace,
    );

    if (!hasStackTrace) {
      return null;
    }

    return event;
  },
});

if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_IS_LOCAL !== 'true'
) {
  getCurrentScope().setClient(client);
  client.init();
}
