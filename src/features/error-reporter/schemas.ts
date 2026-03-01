import { z } from 'zod';

const breadcrumbSchema = z.object({
  type: z.enum(['click', 'navigation']),
  label: z.string().max(200),
  timestamp: z.number(),
});

export const errorPayloadSchema = z.object({
  name: z.string().max(200),
  message: z.string().max(2000),
  stack: z.string().max(10_000).optional(),
  url: z.string().max(2000),
  timestamp: z.number(),
  breadcrumbs: z.array(breadcrumbSchema).max(20),
});

export type ErrorPayload = z.infer<typeof errorPayloadSchema>;
export type Breadcrumb = z.infer<typeof breadcrumbSchema>;
