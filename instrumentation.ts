import * as Sentry from '@sentry/nextjs';

export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  Sentry.init({
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
    beforeSend: (event) => {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
        delete event.request.data;
      }
      return event;
    },
  });
};

export const onRequestError = Sentry.captureRequestError;
