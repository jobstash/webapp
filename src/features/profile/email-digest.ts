import { z } from 'zod';

export const emailDigestStateSchema = z.object({
  email: z.string().email().nullable(),
  status: z.enum(['off', 'pending', 'subscribed']),
  requestedAt: z.string().nullable(),
  confirmedAt: z.string().nullable(),
});

export type EmailDigestState = z.infer<typeof emailDigestStateSchema>;
