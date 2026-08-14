'use client';

import type { EChartsCoreOption } from 'echarts/core';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type { DeveloperOrganization } from '../schemas';
import { buildStableAtlasPositions } from './organization-layout';

type Range = '1y' | '3y' | 'all';

interface Props {
  organizations: DeveloperOrganization[];
  range: Range;
  scopeLabel: string;
}

type BubbleDatum = {
  name: string;
  organizationSlug: string;
  cohort: string;
  activePeople: number;
  change: number;
  labelVisible: boolean;
  value: [number, number, number];
  itemStyle: { color: string; opacity: number };
};

const rangeLength: Record<Range, number | null> = {
  '1y': 12,
  '3y': 36,
  all: null,
};

const monthLabel = (period: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${period}T00:00:00Z`));

const changeLabel = (value: number) =>
  value === 0
    ? 'no monthly change'
    : `${value > 0 ? '+' : ''}${value} vs prior month`;

export const OrganizationBubbleTimeline = ({
  organizations,
  range,
  scopeLabel,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const positioned = useMemo(
    () =>
      organizations.filter(
        (organization) =>
          organization.layoutX !== null && organization.layoutY !== null,
      ),
    [organizations],
  );
  const periods = useMemo(() => {
    const allPeriods = [
      ...new Set(
        positioned.flatMap((organization) =>
          organization.series.map((point) => point.period),
        ),
      ),
    ].sort();
    const length = rangeLength[range];
    return length === null ? allPeriods : allPeriods.slice(-length);
  }, [positioned, range]);
  const [periodIndex, setPeriodIndex] = useState(
    Math.max(0, periods.length - 1),
  );
  const atlasPositions = useMemo(
    () =>
      buildStableAtlasPositions(
        positioned.map((organization) => ({
          organizationKey: organization.organizationKey,
          layoutX: organization.layoutX ?? 0,
          layoutY: organization.layoutY ?? 0,
        })),
      ),
    [positioned],
  );

  useEffect(() => {
    setPeriodIndex(Math.max(0, periods.length - 1));
    setIsPlaying(false);
  }, [periods.length, range]);

  useEffect(() => {
    if (!isPlaying || periods.length < 2) return;
    const interval = window.setInterval(() => {
      setPeriodIndex((current) =>
        current >= periods.length - 1 ? 0 : current + 1,
      );
    }, 900);
    return () => window.clearInterval(interval);
  }, [isPlaying, periods.length]);

  const period = periods[periodIndex] ?? '';
  const globalMaximum = useMemo(
    () =>
      Math.max(
        1,
        ...positioned.flatMap((organization) =>
          organization.series.map((point) => point.activePeople),
        ),
      ),
    [positioned],
  );

  const option = useMemo<EChartsCoreOption>(() => {
    const pointAt = (organization: DeveloperOrganization, at: string) =>
      organization.series.find((point) => point.period === at)?.activePeople ??
      0;
    const previousPeriod = periods[Math.max(0, periodIndex - 1)] ?? period;
    const active = positioned
      .map((organization) => ({
        organization,
        count: pointAt(organization, period),
      }))
      .filter((entry) => entry.count > 0)
      .sort((left, right) => right.count - left.count);
    const labeled = new Set(
      active.slice(0, 14).map((entry) => entry.organization.organizationKey),
    );
    const data: BubbleDatum[] = positioned.map((organization) => {
      const activePeople = pointAt(organization, period);
      const change = activePeople - pointAt(organization, previousPeriod);
      const atlasPosition = atlasPositions.get(organization.organizationKey);
      return {
        name: organization.organizationName,
        organizationSlug: organization.organizationSlug,
        cohort: organization.cohort,
        activePeople,
        change,
        labelVisible: labeled.has(organization.organizationKey),
        value: [atlasPosition?.x ?? 0, atlasPosition?.y ?? 0, activePeople],
        itemStyle: {
          color: change > 0 ? '#34d399' : change < 0 ? '#fb7185' : '#60a5fa',
          opacity: activePeople > 0 ? 0.78 : 0,
        },
      };
    });

    return {
      animationDuration: 300,
      animationDurationUpdate: 650,
      animationEasingUpdate: 'cubicOut',
      backgroundColor: 'transparent',
      grid: { top: 10, right: 10, bottom: 10, left: 10 },
      xAxis: {
        type: 'value',
        min: -1.08,
        max: 1.08,
        show: false,
      },
      yAxis: {
        type: 'value',
        min: -1.08,
        max: 1.08,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        renderMode: 'richText',
        backgroundColor: '#111512',
        borderColor: '#2d3932',
        textStyle: { color: '#f5f7f5' },
        formatter: ({ data: rawData }: { data: BubbleDatum }) => {
          const item = rawData;
          return `${item.name}\n${item.activePeople.toLocaleString()} internal people\n${changeLabel(item.change)}\n${item.cohort}`;
        },
      },
      series: [
        {
          type: 'scatter',
          data,
          symbolSize: (value: [number, number, number]) =>
            value[2] <= 0
              ? 0
              : Math.max(7, Math.sqrt(value[2] / globalMaximum) * 92),
          label: {
            show: true,
            position: 'right',
            color: '#e8eeea',
            fontSize: 11,
            formatter: ({ data: rawData }: { data: BubbleDatum }) =>
              rawData.labelVisible ? rawData.name : '',
          },
          labelLayout: { hideOverlap: true },
          emphasis: {
            focus: 'self',
            scale: 1.12,
            itemStyle: { opacity: 1, borderColor: '#f8faf9', borderWidth: 2 },
          },
        },
      ],
    };
  }, [atlasPositions, globalMaximum, period, periodIndex, periods, positioned]);

  if (positioned.length === 0 || periods.length === 0) return null;

  const organizationSubject =
    scopeLabel.toLowerCase() === 'all sectors'
      ? 'Each organization'
      : `Each ${scopeLabel} organization`;

  return (
    <section className='overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 md:p-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-xs font-semibold tracking-[0.18em] text-emerald-400 uppercase'>
            Organization atlas
          </p>
          <h2 className='mt-1 text-2xl font-bold'>
            Teams growing and shrinking
          </h2>
          <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
            {organizationSubject} keeps the same position over time. Bubble area
            represents monthly active internal people; green teams grew, red
            teams shrank, and blue teams were unchanged.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setIsPlaying((playing) => !playing)}
            className='inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm font-bold hover:border-emerald-500/50'
            aria-label={
              isPlaying
                ? 'Pause organization timeline'
                : 'Play organization timeline'
            }
          >
            {isPlaying ? (
              <PauseIcon className='size-4' aria-hidden />
            ) : (
              <PlayIcon className='size-4' aria-hidden />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <strong className='min-w-32 text-right text-sm tabular-nums'>
            {monthLabel(period)}
          </strong>
        </div>
      </div>

      <FlintEChart
        option={option}
        className='mt-5 h-[32rem] w-full rounded-xl bg-background/40'
        ariaLabel={`Organization bubble timeline for ${scopeLabel}, ${monthLabel(period)}`}
        onSelect={(data) => {
          const slug = data.organizationSlug;
          if (typeof slug === 'string' && slug) {
            window.location.assign(
              `https://ecosystem.vision/organizations/info/${slug}`,
            );
          }
        }}
      />

      <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center'>
        <input
          type='range'
          min={0}
          max={Math.max(0, periods.length - 1)}
          value={periodIndex}
          onChange={(event) => {
            setPeriodIndex(Number(event.target.value));
            setIsPlaying(false);
          }}
          aria-label='Organization timeline month'
          className='h-2 flex-1 cursor-pointer accent-emerald-400'
        />
        <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
          {[
            ['bg-emerald-400', 'Growing'],
            ['bg-rose-400', 'Shrinking'],
            ['bg-blue-400', 'Unchanged'],
          ].map(([color, label]) => (
            <span key={label} className='inline-flex items-center gap-1.5'>
              <span className={cn('size-2 rounded-full', color)} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className='mt-3 text-xs text-muted-foreground'>
        Fixed positions come from the collaboration graph, so movement on screen
        is reserved for team-size change. Select a bubble to inspect the
        organization on Ecosystem Vision.
      </p>
    </section>
  );
};
