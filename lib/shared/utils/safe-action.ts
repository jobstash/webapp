import { createSafeActionClient } from 'next-safe-action';
import { valibotAdapter } from 'next-safe-action/adapters/valibot';

import * as Sentry from '@sentry/nextjs';
import * as v from 'valibot';

import { ERROR_MESSAGE } from '@/lib/shared/core/errors';

const metadataSchema = v.object({
  actionName: v.string(),
});

export const actionClient = createSafeActionClient({
  validationAdapter: valibotAdapter(),
  defineMetadataSchema: () => metadataSchema,
  handleServerError: (e, utils) => {
    const { clientInput, metadata } = utils;

    Sentry.captureException(e, (scope) => {
      scope.clear();
      scope.setContext('serverError', { message: e.message });
      scope.setContext('metadata', {
        actionName: metadata.actionName,
      });
      scope.setContext('clientInput', { clientInput });
      return scope;
    });

    // TODO: Handle api errors -> 401, 404, 500 etc.

    // We don't want to leak internal errors to the client
    if (e.constructor.name === 'MwSchemaError') {
      return ERROR_MESSAGE.INTERNAL;
    }

    // Internal error by default
    return ERROR_MESSAGE.INTERNAL;
  },
});
