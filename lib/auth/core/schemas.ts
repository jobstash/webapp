import { z } from 'zod';

import { optionalDataResponseSchema } from '@/lib/shared/core/schemas';

// TODO: Implement actual user schema
export const userSchema = z.object({
  name: z.string(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const getUserResponseSchema = optionalDataResponseSchema(userSchema);
export type GetUserResponseSchema = z.infer<typeof getUserResponseSchema>;
