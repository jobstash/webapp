export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { serverEnv } = await import('@/lib/env/server');
  if (!serverEnv.SENTRY_DSN) return;

  const Sentry = await import('@sentry/node');

  Sentry.init({
    dsn: serverEnv.SENTRY_DSN,
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
