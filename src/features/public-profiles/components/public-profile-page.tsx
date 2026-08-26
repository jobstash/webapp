import Link from 'next/link';
import { Building2Icon, ExternalLinkIcon, ShieldAlertIcon } from 'lucide-react';

import { ImageWithFallback } from '@/components/image-with-fallback';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/server/utils';
import type { PublicProfile } from '../schemas';
import {
  NoticeAppealForm,
  ProfileContributionForms,
} from './profile-contribution-forms';

const facetValues = (value: string | string[] | null | undefined): string[] =>
  value ? (Array.isArray(value) ? value : [value]) : [];

const childHref = (child: PublicProfile['children'][number]): string => {
  const slug = child.slug ?? slugify(child.name);
  return child.type === 'organization'
    ? `/o-${slug}`
    : `/?projects=${encodeURIComponent(slug)}`;
};

const money = (value: number, currency: string): string =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const Initials = ({ name }: { name: string }) => (
  <span className='flex size-20 items-center justify-center rounded-2xl bg-muted text-2xl font-semibold'>
    {name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()}
  </span>
);

export const PublicProfilePage = ({ profile }: { profile: PublicProfile }) => {
  const { info } = profile;
  const facets = [
    ...facetValues(info.profileType),
    ...facetValues(info.profileSector),
    ...facetValues(info.profileStatus),
  ];

  return (
    <div className='mx-auto max-w-5xl space-y-6 pb-16'>
      <header className='rounded-2xl border border-border/60 bg-card/60 p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-start'>
          <ImageWithFallback
            src={info.logo ?? ''}
            alt=''
            width={80}
            height={80}
            className='size-20 rounded-2xl object-cover'
            fallback={<Initials name={info.displayName} />}
          />
          <div className='min-w-0 grow'>
            <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
              {profile.category ?? 'Profile'}
            </p>
            <h1 className='mt-1 text-3xl font-bold tracking-tight'>
              {info.displayName}
            </h1>
            {info.tagline && (
              <p className='mt-2 text-lg text-muted-foreground'>
                {info.tagline}
              </p>
            )}
            {facets.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {[...new Set(facets)].map((facet) => (
                  <span
                    key={facet}
                    className='rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs'
                  >
                    {facet}
                  </span>
                ))}
              </div>
            )}
          </div>
          {info.canonicalSite && (
            <Link
              href={info.canonicalSite}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted'
            >
              Website <ExternalLinkIcon className='size-3.5' />
            </Link>
          )}
        </div>
        {info.summary && (
          <p className='mt-5 max-w-3xl text-base leading-7 font-medium'>
            {info.summary}
          </p>
        )}
        {info.description && (
          <p className='mt-3 max-w-3xl leading-7 whitespace-pre-wrap text-muted-foreground'>
            {info.description}
          </p>
        )}
        {info.foundingDate && (
          <p className='mt-3 text-sm text-muted-foreground'>
            Founded {info.foundingDate}
          </p>
        )}
      </header>

      <section
        className='grid gap-4 sm:grid-cols-2'
        aria-label='Profile totals'
      >
        <div className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <p className='text-sm text-muted-foreground'>Published reviews</p>
          <p className='mt-1 text-3xl font-semibold'>{profile.reviews.count}</p>
          <p className='mt-1 text-sm text-muted-foreground'>
            {profile.reviews.averageRating === null
              ? 'No rating average yet'
              : `${profile.reviews.averageRating.toFixed(2)} / 5 average`}
          </p>
        </div>
        <div className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <p className='text-sm text-muted-foreground'>Salary reports</p>
          <p className='mt-1 text-3xl font-semibold'>
            {profile.salaries.count}
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Aggregated by reported currency
          </p>
        </div>
      </section>

      {profile.salaries.byCurrency.length > 0 && (
        <section className='rounded-2xl border border-border/60 bg-card/60 p-5'>
          <h2 className='text-lg font-semibold'>Reported compensation</h2>
          <div className='mt-3 overflow-x-auto'>
            <table className='w-full min-w-xl text-left text-sm'>
              <thead className='text-muted-foreground'>
                <tr>
                  <th className='pb-2'>Currency</th>
                  <th className='pb-2'>Reports</th>
                  <th className='pb-2'>Average</th>
                  <th className='pb-2'>Range</th>
                </tr>
              </thead>
              <tbody>
                {profile.salaries.byCurrency.map((salary) => (
                  <tr
                    key={salary.currency}
                    className='border-t border-border/50'
                  >
                    <td className='py-3 font-medium'>{salary.currency}</td>
                    <td className='py-3'>{salary.count}</td>
                    <td className='py-3'>
                      {money(salary.average, salary.currency)}
                    </td>
                    <td className='py-3'>
                      {money(salary.minimum, salary.currency)} –{' '}
                      {money(salary.maximum, salary.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {profile.children.length > 0 && (
        <section>
          <h2 className='text-lg font-semibold'>Organizations and projects</h2>
          <div className='mt-3 grid gap-3 sm:grid-cols-2'>
            {profile.children.map((child) => (
              <Link
                key={`${child.type}-${child.id ?? child.name}`}
                href={childHref(child)}
                className='rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:bg-muted/40'
              >
                <p className='flex items-center gap-2 font-medium'>
                  <Building2Icon className='size-4' /> {child.name}
                </p>
                <p className='mt-1 text-xs tracking-wide text-muted-foreground uppercase'>
                  {child.type}
                </p>
                {child.summary && (
                  <p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
                    {child.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProfileContributionForms profile={profile} />

      {profile.notices.length > 0 && (
        <section aria-labelledby='profile-notices'>
          <h2
            id='profile-notices'
            className='flex items-center gap-2 text-lg font-semibold'
          >
            <ShieldAlertIcon className='size-4' /> Public notices
          </h2>
          <div className='mt-3 space-y-3'>
            {profile.notices.map((notice) => (
              <article
                key={notice.id}
                className={cn(
                  'rounded-2xl border border-amber-500/30',
                  'bg-amber-500/5 p-4',
                )}
              >
                <p className='text-sm'>{notice.text}</p>
                <p className='mt-2 text-xs text-muted-foreground'>
                  Decided {new Date(notice.decidedAt).toLocaleDateString('en')}
                </p>
                <NoticeAppealForm noticeId={notice.id} />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
