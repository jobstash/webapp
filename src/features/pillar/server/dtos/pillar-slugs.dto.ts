import 'server-only';

import { z } from 'zod';

export const pillarSlugsDto = z.string().array();
export type PillarSlugsDto = z.infer<typeof pillarSlugsDto>;
