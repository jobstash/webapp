import * as v from 'valibot';

export const pillarSlugsDto = v.array(v.string());
export type PillarSlugsDto = v.InferOutput<typeof pillarSlugsDto>;
