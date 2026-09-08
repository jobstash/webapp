import { z } from 'zod';

export const availabilitySchema = z.object({
  availableForWork: z.boolean(),
});

export const updateAvailabilitySchema = z
  .object({
    availability: z.boolean(),
  })
  .strict();
