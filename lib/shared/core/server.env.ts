import 'server-only';

import { createEnv } from '@t3-oss/env-core';
import * as dotenv from 'dotenv';
import { z } from 'zod/v4';

dotenv.config();

export const SERVER_ENVS = createEnv({
  server: {
    SESSION_PWD: z.string(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    ...process.env,
    SESSION_PWD: process.env.SESSION_PWD ?? '',
  },
});
