import { captureRouterTransitionStart, init } from '@sentry/nextjs';

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    graphQL: { document: false, variables: false },
    genAI: { inputs: false, outputs: false },
    mcp: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    stackFrameVariables: false,
  },
  integrations: (defaults) =>
    defaults.filter((i) => i.name !== 'BrowserTracing'),
});

export const onRouterTransitionStart = captureRouterTransitionStart;
