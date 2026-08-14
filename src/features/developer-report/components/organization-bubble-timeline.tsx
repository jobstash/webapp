'use client';

import type { EChartsCoreOption } from 'echarts/core';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { FlintEChart } from '@/features/job-market/components/flint-echart';
import { cn } from '@/lib/utils';
import type { DeveloperOrganization } from '../schemas';
import { buildStableAtlasPositions } from './organization-layout';

interface Props {
  organizations: DeveloperOrganization[];
  scopeLabel: string;
  rangeLabel: string;
}

type BubbleDatum = {
  name: string;
  organizationSlug: string;
  cohort: string;
  contributors: number;
  internalPeople: number;
  maintainers: number;
  activeLeads: number;
  change: number;
  labelVisible: boolean;
  layer: 'contributors' | 'internal' | 'maintainers';
  value: [number, number, number];
  itemStyle: {
    color: string;
    opacity: number;
    borderColor?: string;
    borderWidth?: number;
  };
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
  scopeLabel,
  rangeLabel,
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
    return allPeriods;
  }, [positioned]);
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
  }, [periods.length]);

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
          organization.series.map((point) => point.activeContributors),
        ),
      ),
    [positioned],
  );

  const option = useMemo<EChartsCoreOption>(() => {
    const pointAt = (organization: DeveloperOrganization, at: string) =>
      organization.series.find((point) => point.period === at) ?? {
        period: at,
        activeContributors: 0,
        activePeople: 0,
        activeMaintainers: 0,
        activeLeads: 0,
      };
    const previousPeriod = periods[Math.max(0, periodIndex - 1)] ?? period;
    const active = positioned
      .map((organization) => ({
        organization,
        count: pointAt(organization, period).activeContributors,
      }))
      .filter((entry) => entry.count > 0)
      .sort((left, right) => right.count - left.count);
    const labeled = new Set(
      active.slice(0, 14).map((entry) => entry.organization.organizationKey),
    );
    const dataFor = (
      layer: BubbleDatum['layer'],
      value: (point: ReturnType<typeof pointAt>) => number,
    ): BubbleDatum[] =>
      positioned.map((organization) => {
        const point = pointAt(organization, period);
        const prior = pointAt(organization, previousPeriod);
        const count = value(point);
        const change = point.activeContributors - prior.activeContributors;
        const atlasPosition = atlasPositions.get(organization.organizationKey);
        const growthColor =
          change > 0 ? '#34d399' : change < 0 ? '#fb7185' : '#60a5fa';
        const layerStyle = {
          contributors: {
            color: '#3b82f6',
            opacity: count > 0 ? 0.2 : 0,
            borderColor: growthColor,
            borderWidth: 2,
          },
          internal: {
            color: '#34d399',
            opacity: count > 0 ? 0.7 : 0,
            borderColor: '#a7f3d0',
            borderWidth: 1,
          },
          maintainers: {
            color: '#c084fc',
            opacity: count > 0 ? 0.92 : 0,
            borderColor: '#e9d5ff',
            borderWidth: 1,
          },
        }[layer];
        return {
          name: organization.organizationName,
          organizationSlug: organization.organizationSlug,
          cohort: organization.cohort,
          contributors: point.activeContributors,
          internalPeople: point.activePeople,
          maintainers: point.activeMaintainers,
          activeLeads: point.activeLeads,
          change,
          labelVisible: labeled.has(organization.organizationKey),
          layer,
          value: [atlasPosition?.x ?? 0, atlasPosition?.y ?? 0, count],
          itemStyle: layerStyle,
        };
      });

    const bubbleSize = (value: [number, number, number]) =>
      value[2] <= 0
        ? 0
        : Math.max(6, Math.sqrt(value[2] / globalMaximum) * 104);
    const outerData = dataFor(
      'contributors',
      (point) => point.activeContributors,
    );
    const internalData = dataFor('internal', (point) => point.activePeople);
    const maintainerData = dataFor(
      'maintainers',
      (point) => point.activeMaintainers,
    );

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
          const internalShare =
            item.contributors > 0
              ? `${((item.internalPeople / item.contributors) * 100).toFixed(1)}%`
              : '—';
          return `${item.name}\n${item.contributors.toLocaleString()} contributors\n${item.internalPeople.toLocaleString()} internal (${internalShare})\n${item.maintainers.toLocaleString()} maintainers · ${item.activeLeads.toLocaleString()} leads\n${changeLabel(item.change)} contributors\n${item.cohort}`;
        },
      },
      series: [
        {
          name: 'All contributors',
          type: 'scatter',
          z: 1,
          data: outerData,
          symbolSize: bubbleSize,
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
            scale: 1.08,
            itemStyle: { opacity: 1, borderColor: '#f8faf9', borderWidth: 2 },
          },
        },
        {
          name: 'Verified internal people',
          type: 'scatter',
          z: 2,
          data: internalData,
          symbolSize: bubbleSize,
          emphasis: {
            focus: 'self',
            scale: 1.08,
            itemStyle: { opacity: 1, borderColor: '#f8faf9', borderWidth: 2 },
          },
        },
        {
          name: 'Maintainers',
          type: 'scatter',
          z: 3,
          data: maintainerData,
          symbolSize: bubbleSize,
          emphasis: {
            focus: 'self',
            scale: 1.08,
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
            Contributor and workforce layers over time
          </h2>
          <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>
            {organizationSubject} keeps the same position across{' '}
            {rangeLabel.toLowerCase()}. Each outer circle is all contributors;
            the inner green circle is verified internal people and the purple
            core is maintainers. Outer borders show contributor growth or
            contraction from the prior month.
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
        <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
          {[
            ['border-2 border-blue-400 bg-blue-400/20', 'All contributors'],
            ['bg-emerald-400', 'Verified internal'],
            ['bg-purple-400', 'Maintainers'],
            ['border-2 border-emerald-400', 'Contributor count grew'],
            ['border-2 border-rose-400', 'Contributor count shrank'],
          ].map(([color, label]) => (
            <span key={label} className='inline-flex items-center gap-1.5'>
              <span className={cn('size-3 rounded-full', color)} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className='mt-3 text-xs text-muted-foreground'>
        The slider covers the complete selected report interval. Fixed positions
        come from the collaboration graph, so only the nested population sizes
        change. Select any circle to inspect the organization on Ecosystem
        Vision.
      </p>
    </section>
  );
};
