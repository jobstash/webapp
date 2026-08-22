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
  const { paths, byContinent, byCountry, countryRows } = useMemo(() => {
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
    const continentMetrics = new Map(
      geography
        .filter(
          (entry) =>
            entry.segment === 'local' && entry.regionType === 'continent',
        )
        .map((entry) => [entry.regionLabel, entry]),
    );
    const countryEntries = geography.filter(
      (entry) => entry.segment === 'local' && entry.regionType === 'country',
    );
    const metadataFor = (metric: JobMarketCompensation) => {
      const code = metric.countryCode?.toUpperCase() ?? '';
      return countryMetadata.find(
        (country) =>
          country.adm0A3 === code ||
          country.isoA3 === code ||
          country.isoA2 === code ||
          country.slug === metric.regionSlug ||
          country.name === metric.regionLabel,
      );
    };
    const countryMetrics = new Map(
      countryEntries.flatMap((metric) => {
        const metadata = metadataFor(metric);
        return metadata ? [[metadata.adm0A3, metric] as const] : [];
      }),
    );
    const mappedPaths = collection.features.map((country) => {
      const id = country.properties.id ?? '';
      return {
        id,
        name: country.properties.name ?? id,
        continent: continents.get(id) ?? null,
        d: path(country) ?? '',
      };
    });
    return {
      paths: mappedPaths,
      byContinent: continentMetrics,
      byCountry: countryMetrics,
      countryRows: countryEntries.map((metric) => {
        const continent = metadataFor(metric)?.continent ?? null;
        return {
          metric,
          continent,
          fallback: continent ? continentMetrics.get(continent) : undefined,
        };
      }),
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
            Local monthly salaries by country
          </title>
          <desc id='local-pay-map-description'>
            Countries use their own onsite and hybrid salary evidence. A
            continent estimate is used only as a clearly labelled fallback for
            an active country whose own salary evidence is sparse.
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
            const metric = byCountry.get(country.id);
            const continentMetric = country.continent
              ? byContinent.get(country.continent)
              : undefined;
            const salaryMetric = !metric
              ? undefined
              : metric.reliable
                ? metric
                : continentMetric?.reliable
                  ? continentMetric
                  : metric;
            const usesFallback = Boolean(
              metric && !metric.reliable && continentMetric?.reliable,
            );
            const href = metric
              ? `/l-${metric.regionSlug}${
                  classificationParam
                    ? `?classifications=${encodeURIComponent(classificationParam)}`
                    : ''
                }`
              : null;
            const salarySummary = metric?.reliable
              ? `${metric.activeJobs} open jobs · ${monthlySalary(metric.medianMonthlyUsd)}`
              : usesFallback && continentMetric
                ? `${metric?.activeJobs ?? 0} open jobs · ${monthlySalary(continentMetric.medianMonthlyUsd)} ${country.continent} fallback (${metric?.sampleCount ?? 0} country salaries)`
                : metric
                  ? `${metric.activeJobs} open jobs · insufficient salary evidence (${metric.sampleCount} salaries, ${metric.employerCount} employers)`
                  : 'No open local jobs in this selection';
            const tooltip = `${country.name} · ${country.continent ?? 'No region'} · ${salarySummary}`;
            const path = (
              <path
                d={country.d}
                fill={
                  salaryMetric?.reliable
                    ? salaryColor(salaryMetric.medianMonthlyUsd)
                    : metric
                      ? 'url(#insufficient-pay-data)'
                      : '#18181b'
                }
                stroke='#090b0d'
                strokeWidth='0.7'
                className={href ? 'transition-opacity hover:opacity-75' : ''}
              >
                <title>{tooltip}</title>
              </path>
            );
            return href ? (
              <Link
                key={country.id}
                href={href}
                aria-label={String(`Open ${country.name} jobs`)}
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
          <span className='ml-auto'>Country data · fixed $3K–$20K scale</span>
        </div>
      </div>

      <div className='mt-3 overflow-x-auto'>
        <table className='w-full min-w-[940px] text-left text-sm'>
          <thead className='text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='px-3 py-2'>Country market</th>
              <th className='px-3 py-2'>Open jobs</th>
              <th className='px-3 py-2'>Hiring companies</th>
              <th className='px-3 py-2'>Median</th>
              <th className='px-3 py-2'>Middle 50%</th>
              <th className='px-3 py-2'>Salary evidence</th>
              <th className='px-3 py-2'>Salary basis</th>
              <th className='px-3 py-2'>Active onsite / hybrid</th>
            </tr>
          </thead>
          <tbody>
            {countryRows
              .sort(
                (left, right) =>
                  right.metric.activeJobs - left.metric.activeJobs ||
                  left.metric.regionLabel.localeCompare(
                    right.metric.regionLabel,
                  ),
              )
              .map(({ metric: entry, continent, fallback }) => (
                <tr
                  key={entry.regionSlug}
                  className='border-t border-border/50'
                >
                  <td className='px-3 py-3 font-medium'>
                    <Link
                      href={`/l-${entry.regionSlug}${
                        classificationParam
                          ? `?classifications=${encodeURIComponent(classificationParam)}`
                          : ''
                      }`}
                      className='hover:text-emerald-400 hover:underline'
                    >
                      {entry.regionLabel}
                    </Link>
                  </td>
                  <td className='px-3 py-3'>{entry.activeJobs}</td>
                  <td className='px-3 py-3'>{entry.hiringCompanies}</td>
                  <td className='px-3 py-3'>
                    {entry.reliable
                      ? monthlySalary(entry.medianMonthlyUsd)
                      : fallback?.reliable
                        ? monthlySalary(fallback.medianMonthlyUsd)
                        : 'Insufficient evidence'}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {entry.reliable
                      ? `${monthlySalary(entry.p25MonthlyUsd)} – ${monthlySalary(entry.p75MonthlyUsd)}`
                      : fallback?.reliable
                        ? `${monthlySalary(fallback.p25MonthlyUsd)} – ${monthlySalary(fallback.p75MonthlyUsd)}`
                        : '—'}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {entry.sampleCount} salaries / {entry.employerCount}{' '}
                    employers
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {entry.reliable
                      ? 'Country estimate'
                      : fallback?.reliable
                        ? `${continent} fallback`
                        : 'Building country evidence'}
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
        employers. City and state jobs inherit their canonical country. The map
        uses country salaries first and only falls back to a continent estimate
        for an active country with sparse salary evidence.
      </p>
    </div>
  );
};
