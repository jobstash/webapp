import 'server-only';

import { z } from 'zod';

const serverEnvSchema = z.object({
  SESSION_PWD: z.string().min(32, 'SESSION_PWD must be at least 32 characters long'),
});

export const SERVER_ENVS = (() => {
  const envs = {
    SESSION_PWD: process.env.SESSION_PWD,
  };

  const result = serverEnvSchema.safeParse(envs);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.') || '';
        return path || issue.message;
      })
      .join('\n  - ');

    throw new Error(`\nInvalid server envs:\n  - ${errorMessages}\n`);
  }

  return {
    SESSION_PWD: result.data.SESSION_PWD,
  };
})();
