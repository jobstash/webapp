import type { JobMarketCompensationBand } from '../schemas';
import { monthlySalary } from '../lib/format';

const segmentLabel = (segment: 'remote' | 'local') =>
  segment === 'remote' ? 'Remote' : 'Local';

export const CompensationBandChart = ({
  bands,
}: {
  bands: JobMarketCompensationBand[];
}) => {
  const reliable = bands.filter(
    (band) =>
      band.reliable &&
      band.medianMonthlyUsd !== null &&
      band.p25MonthlyUsd !== null &&
      band.p75MonthlyUsd !== null,
  );
  if (reliable.length === 0) return null;
  const maximum = Math.max(
    1,
    ...reliable.map((band) => band.p75MonthlyUsd ?? 0),
  );

  return (
    <div
      className='mt-5 space-y-5'
      role='img'
      aria-label='Listed monthly compensation ranges by seniority and work mode'
    >
      {reliable.map((band) => {
        const p25 = band.p25MonthlyUsd ?? 0;
        const p75 = band.p75MonthlyUsd ?? 0;
        const median = band.medianMonthlyUsd ?? 0;
        const start = (p25 / maximum) * 100;
        const width = Math.max(1, ((p75 - p25) / maximum) * 100);
        const marker = (median / maximum) * 100;
        return (
          <div
            key={`${band.senioritySlug}:${band.segment}`}
            className='grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)_10rem] md:items-center'
          >
            <div>
              <strong className='block text-sm'>{band.seniorityLabel}</strong>
              <span className='text-xs text-muted-foreground'>
                {segmentLabel(band.segment)}
              </span>
            </div>
            <div className='relative h-6' aria-hidden='true'>
              <div className='absolute top-1/2 right-0 left-0 h-px bg-border' />
              <div
                className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${
                  band.segment === 'remote'
                    ? 'bg-emerald-400/70'
                    : 'bg-cyan-400/70'
                }`}
                style={{ left: `${start}%`, width: `${width}%` }}
              />
              <div
                className='absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground'
                style={{ left: `${marker}%` }}
              />
            </div>
            <div className='text-sm md:text-right'>
              <strong>{monthlySalary(median)}</strong>
              <span className='block text-xs text-muted-foreground'>
                {band.sampleCount} salaries · {band.employerCount} employers
              </span>
            </div>
          </div>
        );
      })}
      <div className='flex justify-between text-xs text-muted-foreground md:pr-40 md:pl-36'>
        <span>$0</span>
        <span>{monthlySalary(maximum)}</span>
      </div>
    </div>
  );
};
