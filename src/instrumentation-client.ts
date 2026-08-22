import { captureRouterTransitionStart, init } from '@sentry/nextjs';

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  sendDefaultPii: false,
  integrations: (defaults) =>
    defaults.filter((i) => i.name !== 'BrowserTracing'),
});

export const onRouterTransitionStart = captureRouterTransitionStart;
