import { z } from 'zod';

import { optionalDataResponseSchema } from '@/lib/shared/core/schemas';

export const locationSchema = z.object({
  country: z.string().min(1, 'Missing country'),
  countryCode: z.string().min(1, 'Missing country code'),
  region: z.string().min(1, 'Missing region'),
  postCode: z.string().nullish(),
  place: z.string().nullish(), // City / Town / Municipality
  locality: z.string().nullish(), // Subdivision / District / Brgy
  neighborhood: z.string().nullish(), // Subdivision / Village
  street: z.string().nullish(), // Street / Road / Poblacion
});
export type LocationSchema = z.infer<typeof locationSchema>;

export const profileInfoSchema = z.object({
  // CV
  cvLink: z.url('Invalid cv link').nullish(),
  // Info
  name: z.string().min(1, 'Missing name'),
  avatar: z.url('Invalid avatar url'),
  location: locationSchema.nullish(),
  preferredContact: z
    .object({
      kind: z.literal(['Email', 'Phone', 'Other']),
      value: z.string(),
    })
    .nullish(),
  // Work Preferences
  isAvailableForWork: z.boolean(),
  preferredWorkMode: z.literal(['Remote', 'Hybrid', 'Onsite']).nullish(),
  expectedSalary: z.object({ min: z.number(), max: z.number() }).nullish(),
  linkedAccounts: z.null(),
  // Skills
  skills: z.array(
    z.object({
      id: z.uuidv4(),
      name: z.string(),
      canTeach: z.boolean(),
    }),
  ),
  // Showcase
  showcases: z.array(
    z.object({
      label: z.string(),
      url: z.url('Invalid url').nullish(),
    }),
  ),
});
export type ProfileInfoSchema = z.infer<typeof profileInfoSchema>;

export const getProfileInfoResponse = optionalDataResponseSchema(profileInfoSchema);
export type GetProfileInfoResponse = z.infer<typeof getProfileInfoResponse>;
