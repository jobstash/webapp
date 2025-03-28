import * as v from 'valibot';

export const pillarSlugsDto = v.array(v.string());
export type PillarSlugsDto = v.InferOutput<typeof pillarSlugsDto>;

export const pillarDeetsDto = v.object({
  title: v.string(),
  description: v.string(),
});
export type PillarDeetsDto = v.InferOutput<typeof pillarDeetsDto>;
