'use server';

export const throwServerError = async () => {
  throw new Error(
    `[Sentry Test] Server action error at ${new Date().toISOString()}`,
  );
};
