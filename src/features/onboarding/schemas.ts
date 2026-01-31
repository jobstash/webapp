import { z } from 'zod';

import { addressSchema, type Address } from '@/lib/schemas';

export type OnboardingStep = 'welcome' | 'resume' | 'skills' | 'connect';

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

export interface OnboardingData {
  resumeFile: File | null;
  parsedResume: ResumeData | null;
  selectedSkills: UserSkill[];
}

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
