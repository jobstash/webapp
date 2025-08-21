import { z } from 'zod';

import { optionalDataResponseSchema } from '@/lib/shared/core/schemas';

export const linkedAccountsSchema = z.object({
  discord: z.string().nullish(),
  telegram: z.string().nullish(),
  google: z.string().nullish(),
  apple: z.string().nullish(),
  github: z.string().nullish(),
  farcaster: z.string().nullish(),
  twitter: z.string().nullish(),
  email: z.string().nullish(),
  wallets: z.array(z.string()),
});
export type LinkedAccountsDto = z.infer<typeof linkedAccountsSchema>;

export const profileInfoDto = z.object({
  wallet: z.string().min(1),
  githubAvatar: z.string().min(1).nullish(),
  name: z.string().min(1).nullish(),
  alternateEmails: z.array(z.string()),
  location: z.object({
    country: z.string().nullish(),
    city: z.string().nullish(),
  }),
  availableForWork: z.boolean().nullish(),
  linkedAccounts: linkedAccountsSchema,
  cryptoNative: z.boolean().optional(),
  cryptoAdjacent: z.boolean().optional(),
});
export type ProfileInfoDto = z.infer<typeof profileInfoDto>;

export const getProfileInfoDtoResponse = optionalDataResponseSchema(profileInfoDto);
export type GetProfileInfoDtoResponse = z.infer<typeof getProfileInfoDtoResponse>;
