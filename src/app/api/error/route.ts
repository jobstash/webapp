import * as Sentry from '@sentry/node';

import { errorPayloadSchema } from '@/features/error-reporter/schemas';
import { serverEnv } from '@/lib/env/server';
import { parseStack } from '@/lib/server/error-reporter/parse-stack';
import {
  checkErrorRateLimit,
  checkOrigin,
  getClientIp,
  runGuards,
} from '@/lib/server/guards';

const NO_CONTENT = new Response(null, { status: 204 });

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request);

  const guardResult = await runGuards(
    () => checkOrigin(request),
    () => checkErrorRateLimit(ip),
  );
  if (guardResult) return guardResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NO_CONTENT;
  }

  const parsed = errorPayloadSchema.safeParse(body);
  if (!parsed.success) return NO_CONTENT;

  const { data } = parsed;

  if (!serverEnv.SENTRY_DSN) {
    console.error(
      `[ErrorReporter] ${data.name}: ${data.message}`,
      data.stack ?? '',
    );
    return NO_CONTENT;
  }

  Sentry.captureEvent({
    exception: {
      values: [
        {
          type: data.name,
          value: data.message,
          mechanism: { type: 'generic', handled: false },
          stacktrace: data.stack
            ? { frames: parseStack(data.stack) }
            : undefined,
        },
      ],
    },
    level: 'error',
    timestamp: data.timestamp / 1000,
    tags: { pageUrl: data.url },
    breadcrumbs: data.breadcrumbs.map((b) => ({
      category: b.type,
      message: b.label,
      timestamp: b.timestamp / 1000,
    })),
  });

  return NO_CONTENT;
};
