'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { monthlySalary } from '../lib/format';
import type { JobMarketCompensation, PillarMarket } from '../schemas';

type GeographyLevel = 'country' | 'region' | 'city' | 'continent';

const GEOGRAPHY_LEVELS: {
  value: GeographyLevel;
  label: string;
  heading: string;
}[] = [
  { value: 'country', label: 'Countries', heading: 'Country market' },
  { value: 'region', label: 'Regions', heading: 'Regional market' },
  { value: 'city', label: 'Cities', heading: 'City market' },
  { value: 'continent', label: 'Continents', heading: 'Continent market' },
];

const jobsHref = (
  pillar: PillarMarket['pillar']['filter'],
  place: JobMarketCompensation['filter'],
) => {
  const params = new URLSearchParams();
  for (const filter of [pillar, place]) {
    if (!filter) continue;
    const current = params.get(filter.paramKey);
    if (!current) params.set(filter.paramKey, filter.value);
    else if (!current.split(',').includes(filter.value)) {
      params.set(filter.paramKey, `${current},${filter.value}`);
    }
  }
  const query = params.toString();
  return query ? `/?${query}` : '/';
};

export const compensationEvidenceCopy = (
  entry: JobMarketCompensation,
  organization: boolean,
) =>
  organization
    ? `${entry.sampleCount} salary listings from this company`
    : `${entry.sampleCount} salaries from ${entry.employerCount} employers`;

export const actionableLocalCompensation = (
  compensation: JobMarketCompensation[],
): JobMarketCompensation[] =>
  compensation.filter(
    (entry) =>
      entry.segment === 'local' &&
      ['country', 'region', 'city', 'continent'].includes(entry.regionType) &&
      entry.evidenceLevel !== 'insufficient' &&
      entry.activeJobs > 0 &&
      entry.filter !== null,
  );

export const LocalCompensationTable = ({
  market,
}: {
  market: PillarMarket;
}) => {
  const [geographyLevel, setGeographyLevel] =
    useState<GeographyLevel>('country');
  const [showAllGeography, setShowAllGeography] = useState(false);
  const geography = actionableLocalCompensation(market.compensation);
  const availableLevels = GEOGRAPHY_LEVELS.filter((level) =>
    geography.some((entry) => entry.regionType === level.value),
  );
  const activeLevel =
    availableLevels.find((level) => level.value === geographyLevel) ??
    availableLevels[0];
  const levelRows = geography
    .filter((entry) => entry.regionType === activeLevel?.value)
    .sort(
      (left, right) =>
        right.activeJobs - left.activeJobs ||
        right.sampleCount - left.sampleCount ||
        left.regionLabel.localeCompare(right.regionLabel),
    );
  const visibleRows = showAllGeography ? levelRows : levelRows.slice(0, 12);
  const organizationPillar = market.pillar.kind === 'organizations';

  if (!activeLevel) return null;

  return (
    <div className='mt-5'>
      <div
        className='flex flex-wrap gap-2'
        aria-label='Geographic salary level'
      >
        {availableLevels.map((level) => (
          <button
            key={level.value}
            type='button'
            onClick={() => {
              setGeographyLevel(level.value);
              setShowAllGeography(false);
            }}
            aria-pressed={activeLevel.value === level.value}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
              activeLevel.value === level.value
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                : 'border-border/60 text-muted-foreground hover:text-foreground',
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
      <div className='mt-3 overflow-x-auto'>
        <table className='w-full min-w-[920px] text-left text-sm'>
          <thead className='text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='px-3 py-2'>{activeLevel.heading}</th>
              <th className='px-3 py-2'>Open jobs</th>
              <th className='px-3 py-2'>Hiring companies</th>
              <th className='px-3 py-2'>Median</th>
              <th className='px-3 py-2'>Middle 50%</th>
              <th className='px-3 py-2'>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((region) => {
              const href = jobsHref(market.pillar.filter, region.filter);
              return (
                <tr
                  key={`${region.regionType}-${region.regionSlug}-${region.filter?.value}`}
                  className='border-t border-border/50 transition-colors hover:bg-muted/20'
                >
                  <td className='px-3 py-3 font-medium'>
                    <Link
                      href={href}
                      className='inline-flex items-center gap-1.5 hover:text-emerald-300'
                    >
                      {region.regionLabel}
                      <ArrowRightIcon className='size-3.5' aria-hidden />
                    </Link>
                  </td>
                  <td className='px-3 py-3'>
                    <Link href={href} className='hover:text-emerald-300'>
                      {region.activeJobs}
                    </Link>
                  </td>
                  <td className='px-3 py-3'>{region.hiringCompanies}</td>
                  <td className='px-3 py-3'>
                    {monthlySalary(region.medianMonthlyUsd)}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {monthlySalary(region.p25MonthlyUsd)} –{' '}
                    {monthlySalary(region.p75MonthlyUsd)}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {compensationEvidenceCopy(region, organizationPillar)}
                    {region.evidenceLevel === 'limited' && (
                      <span className='ml-2 text-amber-300'>Limited</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {levelRows.length > 12 && (
        <button
          type='button'
          onClick={() => setShowAllGeography((current) => !current)}
          className='mt-3 text-sm font-semibold text-emerald-400 hover:text-emerald-300'
        >
          {showAllGeography
            ? 'Show fewer markets'
            : `Show all ${levelRows.length} markets`}
        </button>
      )}
      <p className='px-3 pt-3 text-xs leading-relaxed text-muted-foreground'>
        Open jobs are current; salary evidence covers the past 12 months and
        also uses closed postings. Every place rolls up through its canonical
        city, region, country, and continent hierarchy exactly once.
      </p>
    </div>
  );
};
