import 'server-only';

import { createEnv } from '@t3-oss/env-nextjs';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const SERVER_ENVS = createEnv({
  server: {
    SESSION_PWD: z.string(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    SESSION_PWD: process.env.SESSION_PWD,
  },
});
