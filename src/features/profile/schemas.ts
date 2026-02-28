import { z } from 'zod';

import {
  addressSchema,
  type Address,
  nonEmptyStringSchema,
} from '@/lib/schemas';

// --- Linked accounts ---

export const linkedAccountSchema = z.object({
  type: z.enum([
    'google_oauth',
    'github_oauth',
    'wallet',
    'embedded_wallet',
    'email',
    'farcaster',
  ]),
  email: z.string().nullable(),
  username: z.string().nullable(),
});
export type LinkedAccount = z.infer<typeof linkedAccountSchema>;

export const linkedAccountsResponseSchema = z.object({
  data: linkedAccountSchema.array(),
});

// --- Profile skills ---

export const profileSkillSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type ProfileSkill = z.infer<typeof profileSkillSchema>;

export const profileSkillsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: profileSkillSchema.array(),
});

// --- Showcase ---

export const showcaseItemSchema = z.object({
  label: nonEmptyStringSchema,
  url: nonEmptyStringSchema,
});
export type ShowcaseItem = z.infer<typeof showcaseItemSchema>;

export const profileShowcaseResponseSchema = z.object({
  data: showcaseItemSchema.array(),
});

// --- User skills (editing) ---

export interface UserSkill {
  id: string;
  name: string;
  colorIndex: number;
  isFromResume: boolean;
}

export interface ResumeData {
  resumeId: string;
  fileName: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: Address | null;
  skills: UserSkill[];
  socials: Social[];
}

// --- Tags ---

export const popularTagItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  normalizedName: z.string(),
});
export type PopularTagItem = z.infer<typeof popularTagItemSchema>;

const popularTagsDataSchema = z.object({
  items: z.array(popularTagItemSchema),
  page: z.number(),
  hasMore: z.boolean(),
});

export const popularTagsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: popularTagsDataSchema,
});

// --- Socials ---

export const socialKindSchema = z.enum([
  'github',
  'linkedin',
  'twitter',
  'telegram',
  'discord',
  'website',
  'farcaster',
  'lens',
]);
export type SocialKind = z.infer<typeof socialKindSchema>;

export const socialSchema = z.object({
  kind: socialKindSchema,
  handle: z.string(),
});
export type Social = z.infer<typeof socialSchema>;

// --- Resume parsing ---

export const resumeParseResponseSchema = z.object({
  resumeId: z.string(),
  fileName: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: addressSchema.nullable(),
  skills: z.array(popularTagItemSchema),
  socials: z.array(socialSchema),
});
