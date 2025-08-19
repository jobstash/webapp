import { z } from 'zod';

import { genericResponseSchema, permissionsSchema } from '@/lib/shared/core/schemas';

export const userCredentialsSchema = z.object({
  token: z.string(),
  permissions: permissionsSchema,
});
export type UserCredentialsSchema = z.infer<typeof userCredentialsSchema>;

// TODO: Implement actual user schema
export const userSchema = z.object({
  ...userCredentialsSchema.shape,
  name: z.string(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const getUserResponseSchema = z.object({
  ...genericResponseSchema.shape,
  data: userSchema.nullable(),
});
export type GetUserResponseSchema = z.infer<typeof getUserResponseSchema>;

export const sessionSchema = z.object({
  user: userSchema,
});
export type SessionSchema = z.infer<typeof sessionSchema>;

export const syncSessionPayloadSchema = z.object({
  privyToken: z.string(),
});
export type SyncSessionPayloadSchema = z.infer<typeof syncSessionPayloadSchema>;
