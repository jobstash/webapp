import * as z from 'zod';

export const staticPillarSlugsSchema = z.array(z.string());
export type StaticPillarSlugsSchema = z.infer<typeof staticPillarSlugsSchema>;

export const pillarDeetsSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export type PillarDeetsSchema = z.infer<typeof pillarDeetsSchema>;
