import * as Sentry from '@sentry/nextjs';

export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    release: `webapp@${process.env.NEXT_PUBLIC_APP_VERSION}`,
    tracesSampleRate: 0,
    sendDefaultPii: false,
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
