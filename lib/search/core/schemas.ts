import * as v from 'valibot';

export const staticPillarSlugsSchema = v.array(v.string());
export type StaticPillarSlugsSchema = v.InferOutput<typeof staticPillarSlugsSchema>;

export const pillarDeetsSchema = v.object({
  title: v.string(),
  description: v.string(),
});
export type PillarDeetsSchema = v.InferOutput<typeof pillarDeetsSchema>;
