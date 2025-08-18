import 'server-only';

import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const SERVER_ENVS = (() => {
  const envs = createEnv({
    server: {
      SESSION_PWD: z.string(),
    },
    runtimeEnv: {
      SESSION_PWD: process.env.SESSION_PWD,
    },
  });

  return {
    SESSION_PWD: envs.SESSION_PWD,
  };
})();
