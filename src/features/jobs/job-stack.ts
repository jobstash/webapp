import { z } from 'zod';

export const jobStackTitleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  location: z.string().nullable(),
  href: z.string().min(1),
});

export type JobStackTitle = z.infer<typeof jobStackTitleSchema>;
