import 'server-only';

import { Output, generateObject, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import type { Address } from '@/lib/schemas';
import {
  type PopularTagItem,
  popularTagItemSchema,
  socialKindSchema,
} from '@/features/profile/schemas';

export { extractText, type ExtractedText } from '@/lib/server/extract-text';

const resumeExtractionSchema = z.object({
  isResume: z
    .boolean()
    .describe(
      "Whether the document is a resume/CV. True if it describes a real person's professional background — even if the format is unconventional. Only false for content that is clearly not about a person's career (e.g. articles, receipts, jokes, random text, spam).",
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
  roleCategory: z
    .string()
    .describe(
      'Inferred professional role based on experience and summary. Examples: "Frontend Developer", "Backend Engineer", "Full-Stack Developer", "DevOps Engineer", "Smart Contract Developer", "Data Engineer", "Designer"',
    ),
  skills: z
    .array(z.string())
    .describe(
      'Core skills relevant to the inferred role, based on actual work experience',
    ),
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

// PDF fallback LLM sometimes echoes platform names as handles (e.g. "GitHub" instead of a real username).
// Strip socials where the handle matches a social kind name — these are broken extractions, not real profiles.
const SOCIAL_KIND_NAMES: Set<string> = new Set(socialKindSchema.options);

const filterBrokenSocials = (socials: ResumeExtraction['socials']) =>
  socials.filter((s) => !SOCIAL_KIND_NAMES.has(s.handle.toLowerCase()));

const SYSTEM_PROMPT = `You are a resume parser that extracts structured data from resume text.

## Step 1: Validate
Determine if this document describes a real person's professional background. Set isResume to true if the text contains ANY of these signals:
- A person's name with contact details (email, phone, LinkedIn, GitHub, etc.)
- Work experience, job titles, or employment history
- Technical skills, programming languages, or tools
- Education, certifications, or training
- Professional summary or career objective

Resumes come in many formats — traditional, minimal, portfolio-style, narrative, academic CV, single-page, multi-section. Unconventional section names (e.g. "WHOAMI" instead of "Summary") or first-person writing style do NOT disqualify a document.

Only set isResume to false if the document is clearly unrelated to a person's career — for example: articles, blog posts with no personal career info, receipts, jokes, lorem ipsum, spam, or completely unrelated content.

If false, return null/empty for all other fields.

## Step 2: Extract contact info
- Full name, email, phone (with country code if present)
- Location: city, state/province, country, ISO 3166-1 alpha-2 country code
- Social profiles: GitHub, LinkedIn, Twitter/X, Telegram, Discord, Farcaster, Lens, personal website. Extract the actual handle or profile URL. If the resume only shows a platform name (e.g. "GitHub") without a username, handle, or URL, do NOT include it in socials — only include entries where you can identify the actual handle or profile URL.

## Step 3: Infer role category
Read the full resume holistically — summary/objective, job titles, and what the candidate actually built or worked on in their experience bullet points. Determine what kind of professional this person is (e.g. "Frontend Developer", "Full-Stack Developer", "Backend Engineer", "Smart Contract Developer", "DevOps Engineer", "Designer", "Data Engineer"). Set roleCategory accordingly.

## Step 4: Extract skills (role-aware)
For each skill mentioned in the resume, ask: "Would a recruiter hiring for this candidate's role consider this skill a core part of their profile?" If the answer is no, leave it out.

Guidelines:
- Prioritize skills the candidate actively used in their work experience, not just listed in a tools section.
- Skills should be coherent with the inferred role. A frontend developer's skill list should read like a frontend developer's profile.
- Peripheral skills (mentioned once, tangential to the role) should be excluded. The candidate can always add more skills later.
- Fewer, high-signal skills are better than an exhaustive list. Aim for around 10 at most.

Return null for fields not found. Return empty arrays for skills/socials if none found.`;

export const parseResume = async (text: string): Promise<ResumeExtraction> => {
  const result = await generateObject({
    model: openai('gpt-4.1-nano'),
    schema: resumeExtractionSchema,
    system: SYSTEM_PROMPT,
    prompt: text,
  });

  return {
    ...result.object,
    socials: filterBrokenSocials(result.object.socials),
  };
};

export const parseResumeFromPdf = async (
  buffer: ArrayBuffer,
): Promise<ResumeExtraction> => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: resumeExtractionSchema }),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Extract resume data from this PDF.' },
          {
            type: 'file',
            data: new Uint8Array(buffer),
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
  });

  const output = await result.output;
  return { ...output, socials: filterBrokenSocials(output.socials) };
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
