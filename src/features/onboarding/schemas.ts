import { z } from 'zod';

export type OnboardingStep = 'welcome' | 'resume' | 'skills' | 'connect';

export interface UserSkill {
  id: string;
  name: string;
  colorIndex: number;
  isFromResume: boolean;
}

export interface ResumeData {
  fileName: string;
  skills: UserSkill[];
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

export const resumeParseResponseSchema = z.object({
  fileName: z.string(),
  skills: z.array(popularTagItemSchema),
});
