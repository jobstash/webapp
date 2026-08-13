'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Countries110m } from '@d3-maps/atlas';
import countryMetadata from '@d3-maps/atlas/metadata/countries';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

import type { JobMarketCompensation } from '../schemas';
import { monthlySalary } from '../lib/format';

type CountryFeature = Feature<Geometry, { id?: string; name?: string }>;

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const salaryColor = (salary: number | null): string => {
  if (salary === null) return '#27272a';
  const normalized = Math.max(0, Math.min(1, (salary - 3_000) / 17_000));
  const hue = 175 - normalized * 45;
  const lightness = 25 + normalized * 30;
  return `hsl(${hue} 58% ${lightness}%)`;
};

export const MarketGeographyMap = ({
  geography,
  classification,
}: {
  geography: JobMarketCompensation[];
  classification: string;
}) => {
  const { paths, byContinent } = useMemo(() => {
    const topology = Countries110m as unknown as Parameters<typeof feature>[0];
    const object = (
      Countries110m as unknown as { objects: { features: never } }
    ).objects.features;
    const collection = feature(topology, object) as unknown as {
      features: CountryFeature[];
    };
    const projection = geoEqualEarth().fitExtent(
      [
        [12, 12],
        [948, 488],
      ],
      collection as FeatureCollection,
    );
    const path = geoPath(projection);
    const continents = new Map(
      countryMetadata.map((country) => [country.adm0A3, country.continent]),
    );
    const metrics = new Map(
      geography
        .filter(
          (entry) => entry.segment === 'local' && entry.regionSlug !== 'local',
        )
        .map((entry) => [entry.regionLabel, entry]),
    );
    return {
      paths: collection.features.map((country) => {
        const id = country.properties.id ?? '';
        return {
          id,
          name: country.properties.name ?? id,
          continent: continents.get(id) ?? null,
          d: path(country) ?? '',
        };
      }),
      byContinent: metrics,
    };
  }, [geography]);

  const classificationParam = classification.startsWith('cl-')
    ? classification.slice(3)
    : null;

  return (
    <div>
      <div className='overflow-hidden rounded-xl border border-border/60 bg-[#090b0d]'>
        <svg
          viewBox='0 0 960 500'
          className='h-auto w-full'
          role='img'
          aria-labelledby='local-pay-map-title local-pay-map-description'
        >
          <title id='local-pay-map-title'>
            Local monthly salaries by continent
          </title>
          <desc id='local-pay-map-description'>
            Countries inherit their continent aggregate. Every active local
            market remains visible even when salary evidence is too sparse for a
            responsible estimate.
          </desc>
          <defs>
            <pattern
              id='insufficient-pay-data'
              width='8'
              height='8'
              patternUnits='userSpaceOnUse'
              patternTransform='rotate(45)'
            >
              <rect width='8' height='8' fill='#1f2937' />
              <line
                x1='0'
                y1='0'
                x2='0'
                y2='8'
                stroke='#64748b'
                strokeWidth='2'
              />
            </pattern>
          </defs>
          <rect width='960' height='500' fill='#090b0d' />
          {paths.map((country) => {
            const metric = country.continent
              ? byContinent.get(country.continent)
              : undefined;
            const href =
              country.continent && metric
                ? `/l-${slugify(country.continent)}${
                    classificationParam
                      ? `?classifications=${encodeURIComponent(classificationParam)}`
                      : ''
                  }`
                : null;
            const path = (
              <path
                d={country.d}
                fill={
                  metric?.reliable
                    ? salaryColor(metric.medianMonthlyUsd)
                    : metric
                      ? 'url(#insufficient-pay-data)'
                      : '#18181b'
                }
                stroke='#090b0d'
                strokeWidth='0.7'
                className={href ? 'transition-opacity hover:opacity-75' : ''}
              >
                <title>
                  {country.name} · {country.continent ?? 'No region'} ·{' '}
                  {metric?.reliable
                    ? `${metric.activeJobs} open jobs · ${monthlySalary(metric.medianMonthlyUsd)}`
                    : metric
                      ? `${metric.activeJobs} open jobs · insufficient salary evidence (${metric.sampleCount} salaries, ${metric.employerCount} employers)`
                      : 'No open local jobs in this selection'}
                </title>
              </path>
            );
            return href ? (
              <Link
                key={country.id}
                href={href}
                aria-label={String(`Open ${country.continent} jobs`)}
              >
                {path}
              </Link>
            ) : (
              <g key={country.id}>{path}</g>
            );
          })}
        </svg>
        <div className='flex flex-wrap items-center gap-4 border-t border-border/50 px-4 py-3 text-xs text-muted-foreground'>
          <span>Lower monthly pay</span>
          <span className='h-2 w-32 rounded-full bg-gradient-to-r from-teal-900 via-emerald-600 to-lime-300' />
          <span>Higher monthly pay</span>
          <span className='ml-auto'>Fixed $3K–$20K monthly scale</span>
        </div>
      </div>

      <div className='mt-3 overflow-x-auto'>
        <table className='w-full min-w-[940px] text-left text-sm'>
          <thead className='text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='px-3 py-2'>Local market</th>
              <th className='px-3 py-2'>Open jobs</th>
              <th className='px-3 py-2'>Hiring companies</th>
              <th className='px-3 py-2'>Median</th>
              <th className='px-3 py-2'>Middle 50%</th>
              <th className='px-3 py-2'>Salary evidence</th>
              <th className='px-3 py-2'>Active onsite / hybrid</th>
            </tr>
          </thead>
          <tbody>
            {[...byContinent.values()]
              .sort(
                (left, right) =>
                  right.activeJobs - left.activeJobs ||
                  left.regionLabel.localeCompare(right.regionLabel),
              )
              .map((entry) => (
                <tr
                  key={entry.regionSlug}
                  className='border-t border-border/50'
                >
                  <td className='px-3 py-3 font-medium'>{entry.regionLabel}</td>
                  <td className='px-3 py-3'>{entry.activeJobs}</td>
                  <td className='px-3 py-3'>{entry.hiringCompanies}</td>
                  <td className='px-3 py-3'>
                    {entry.reliable
                      ? monthlySalary(entry.medianMonthlyUsd)
                      : 'Insufficient evidence'}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {entry.reliable
                      ? `${monthlySalary(entry.p25MonthlyUsd)} – ${monthlySalary(entry.p75MonthlyUsd)}`
                      : '—'}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {entry.sampleCount} salaries / {entry.employerCount}{' '}
                    employers
                  </td>
                  <td className='px-3 py-3'>
                    {entry.activeOnsiteJobs} / {entry.activeHybridJobs}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className='mt-3 text-xs leading-relaxed text-muted-foreground'>
        Open jobs and hiring companies are current. Salary distributions use the
        selected lookback and stay hidden below 10 salaries or 5 distinct
        employers. Jobs tagged to cities, states, or countries roll up through
        the canonical place hierarchy and are counted once per continent.
      </p>
    </div>
  );
};
