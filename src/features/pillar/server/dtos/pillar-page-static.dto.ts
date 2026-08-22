import 'server-only';

import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableStringSchema,
  optionalStringSchema,
} from '@/lib/schemas';
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
  fundingStage: nullableStringSchema.optional(),
  recentlyFunded: z.boolean().optional(),
  teamCoverageStatus: z.enum(['current', 'unknown']).nullable().optional(),
  teamSignalsAsOf: nullableStringSchema.optional(),
  currentMaintainerCount: z.number().nullable().optional(),
  activeLeadCount: z.number().nullable().optional(),
  newActiveLeadCount: z.number().nullable().optional(),
  steppedDownLeadCount: z.number().nullable().optional(),
  movedLeadCount: z.number().nullable().optional(),
  earlyLeadDepartureCount: z.number().nullable().optional(),
});

export const pillarPageStaticDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    jobs: jobListItemDto.array(),
    // Middleware is authoritative for canonical zero-inventory pillars (for
    // example FDE). Optional during a rolling deploy so older payloads still
    // parse and the page can fall back to the local thin-pillar rule.
    indexing: z.enum(['index', 'noindex']).optional(),
    hasEligibleOpenJobs: z.boolean().optional(),
    organization: pillarOrganizationDto.nullish(),
    suggestedPillars: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional()
      .default([]),
  }),
});
export type PillarPageStaticDto = z.infer<typeof pillarPageStaticDto>;
