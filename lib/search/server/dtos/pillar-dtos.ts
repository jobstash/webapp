import * as v from 'valibot';

export const pillarSlugsDto = v.array(v.string());
export type PillarSlugsDto = v.InferOutput<typeof pillarSlugsDto>;

export const pillarDeetsDto = v.object({
  success: v.boolean(),
  message: v.string(),
  data: v.optional(
    v.object({
      title: v.string(),
      description: v.string(),
    }),
  ),
});
export type PillarDeetsDto = v.InferOutput<typeof pillarDeetsDto>;
