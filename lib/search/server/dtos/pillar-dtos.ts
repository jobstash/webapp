import * as z from 'zod';

export const pillarSlugsDto = z.array(z.string());
export type PillarSlugsDto = z.infer<typeof pillarSlugsDto>;

export const pillarDeetsDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.optional(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
});
export type PillarDeetsDto = z.infer<typeof pillarDeetsDto>;
