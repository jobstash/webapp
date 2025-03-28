import * as v from 'valibot';

export const staticPillarSlugsSchema = v.array(v.string());
export type StaticPillarSlugsSchema = v.InferOutput<typeof staticPillarSlugsSchema>;
