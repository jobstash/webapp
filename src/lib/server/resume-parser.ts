import 'server-only';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import type { Address } from '@/lib/schemas';
import {
  type PopularTagItem,
  popularTagItemSchema,
  socialKindSchema,
} from '@/features/onboarding/schemas';

export { extractText, type ExtractedText } from '@/lib/server/extract-text';

const resumeExtractionSchema = z.object({
  isResume: z
    .boolean()
    .describe(
      'Whether the document is actually a resume/CV. False for random text, jokes, troll content, or non-resume documents.',
    ),
  name: z.string().nullable().describe('Full name of the candidate'),
  email: z.string().nullable().describe('Email address'),
  phone: z
    .string()
    .nullable()
    .describe('Phone number with country code if present'),
  location: z
    .object({
      city: z.string().nullable(),
      state: z.string().nullable(),
      country: z.string().nullable(),
      countryCode: z
        .string()
        .nullable()
        .describe('ISO 3166-1 alpha-2 country code'),
    })
    .nullable(),
  skills: z
    .array(z.string())
    .describe('Technical skills, programming languages, frameworks, tools'),
  socials: z
    .array(
      z.object({
        kind: socialKindSchema,
        handle: z.string(),
      }),
    )
    .describe('Social media profiles and links found in the resume'),
});

type ResumeExtraction = z.infer<typeof resumeExtractionSchema>;

export const parseResume = async (text: string): Promise<ResumeExtraction> => {
  const result = await generateObject({
    model: openai('gpt-4.1-nano'),
    schema: resumeExtractionSchema,
    system: `You are a resume parser. Extract structured data from resume text.

First, determine if the document is actually a resume or CV. Set isResume to false if the content is clearly not a resume. If isResume is false, you may return null/empty for all other fields.

Extract the following:
- Full name, email address, phone number (with country code if present)
- Location: city, state/province, country, and infer the ISO 3166-1 alpha-2 country code
- All technical skills, programming languages, frameworks, and tools mentioned
- Social profiles: GitHub, LinkedIn, Twitter/X, Telegram, Discord, Farcaster, Lens, and personal website URLs. Extract the handle or URL as-is.

Return null for any fields that are not found in the resume.
Return empty arrays for skills or socials if none are found.`,
    prompt: text,
  });

  return result.object;
};

export const matchSkills = async (
  rawSkills: string[],
): Promise<PopularTagItem[]> => {
  if (rawSkills.length === 0) return [];

  try {
    const response = await fetch(`${clientEnv.MW_URL}/tags/batch-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: rawSkills }),
    });

    const json = await response.json();

    const parsed = z
      .object({
        success: z.boolean(),
        message: z.string(),
        data: z.array(popularTagItemSchema),
      })
      .parse(json);

    return parsed.data;
  } catch {
    return [];
  }
};

export const transformAddress = (
  location: ResumeExtraction['location'],
): Address | null => {
  if (!location) return null;

  const { city, state, country, countryCode } = location;

  if (!city && !state && !country && !countryCode) return null;
  if (!country || !countryCode) return null;

  const address: Address = {
    country,
    countryCode,
    isRemote: false,
  };

  if (city) {
    address.locality = city;
  }

  if (state) {
    address.region = state;
  }

  return address;
};
