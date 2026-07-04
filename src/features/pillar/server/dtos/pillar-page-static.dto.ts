import 'server-only';

import { z } from 'zod';

import { nonEmptyStringSchema, optionalStringSchema } from '@/lib/schemas';
import { fundingRoundDto, investorDto } from '@/lib/server/dtos';
import {
  jobListItemDto,
  jobOrgProjectDto,
} from '@/features/jobs/server/dtos/job-list-item.dto';

// Emitted by newer MW versions for o-* pillars; lets zero-job org pillars
// still show real org content. Everything beyond `name` is optional so
// older MW payloads (slim shape) keep parsing.
const pillarOrganizationDto = z.object({
  name: nonEmptyStringSchema,
  normalizedName: optionalStringSchema,
  summary: optionalStringSchema,
  description: optionalStringSchema,
  logoUrl: optionalStringSchema,
  location: optionalStringSchema,
  headcountEstimate: z.number().nullish(),
  website: optionalStringSchema,
  discord: optionalStringSchema,
  telegram: optionalStringSchema,
  twitter: optionalStringSchema,
  github: optionalStringSchema,
  docs: optionalStringSchema,
  projects: jobOrgProjectDto.array().optional(),
  fundingRounds: fundingRoundDto.array().optional(),
  investors: investorDto.array().optional(),
});

export const pillarPageStaticDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    jobs: jobListItemDto.array(),
    organization: pillarOrganizationDto.nullish(),
    suggestedPillars: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional()
      .default([]),
  }),
});
export type PillarPageStaticDto = z.infer<typeof pillarPageStaticDto>;
