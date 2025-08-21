import { z } from 'zod';

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

export const userInfoSchema = z.object({
  // CV
  cvLink: z.url('Invalid cv link').nullish(),
  // Info
  name: z.string().min(1, 'Missing name').nullish(),
  avatar: z.url('Invalid avatar url').nullish(),
  location: locationSchema.nullish(),
  preferredContact: z.object({
    kind: z.literal(['Email', 'Phone', 'Other']),
    value: z.string(),
  }),
  // Work Preferences
  isLookingForWork: z.boolean(),
  preferredWorkMode: z.literal(['Remote', 'Hybrid', 'Onsite']),
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
export type UserInfoSchema = z.infer<typeof userInfoSchema>;
