import { z } from 'zod';

import { optionalDataResponseSchema, permissionsSchema } from '@/lib/shared/core/schemas';

// TODO: Implement actual user schema
export const userSchema = z.object({
  name: z.string(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const getUserResponseSchema = optionalDataResponseSchema(userSchema);
export type GetUserResponseSchema = z.infer<typeof getUserResponseSchema>;

export const userCredentialsSchema = z.object({
  token: z.string(),
  permissions: permissionsSchema,
});
export type UserCredentialsSchema = z.infer<typeof userCredentialsSchema>;

export const getUserCredentialsResponseSchema =
  optionalDataResponseSchema(userCredentialsSchema);
export type GetUserCredentialsResponseSchema = z.infer<
  typeof getUserCredentialsResponseSchema
>;
