import Link from 'next/link';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { DiscordIcon } from '@/components/svg/discord-icon';
import { GithubIcon } from '@/components/svg/github-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import {
  type JobOrganizationSchema,
  type JobOrgSocialsSchema,
} from '@/features/jobs/schemas';

interface OrgInfoCardProps {
  organization: JobOrganizationSchema;
  /** Hide the "View jobs by" button (e.g. on the org's own pillar page) */
  hideJobsButton?: boolean;
}

const SOCIAL_LINKS: {
  key: keyof JobOrgSocialsSchema;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'twitter', label: 'X (Twitter)', icon: TwitterIcon },
  { key: 'telegram', label: 'Telegram', icon: TelegramIcon },
  { key: 'discord', label: 'Discord', icon: DiscordIcon },
  { key: 'github', label: 'GitHub', icon: GithubIcon },
  { key: 'docs', label: 'Documentation', icon: BookOpenIcon },
];

const OrgSocials = ({
  name,
  socials,
}: {
  name: string;
  socials: JobOrgSocialsSchema;
}) => {
  const links = SOCIAL_LINKS.filter(({ key }) => socials[key]);
  if (links.length === 0) return null;

  return (
    <div className='flex items-center gap-3'>
      {links.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          href={socials[key] as string}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`${name} on ${label}`}
          title={label}
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          <Icon className='size-4' />
        </Link>
      ))}
    </div>
  );
};

const OrgProjects = ({
  projects,
}: {
  projects: JobOrganizationSchema['projects'];
}) => {
  if (projects.length === 0) return null;

  return (
    <div className='space-y-2'>
      <p className='text-xs font-medium text-muted-foreground'>Projects</p>
      <div className='space-y-1.5'>
        {projects.map((project) => {
          const row = (
            <>
              <ImageWithFallback
                src={project.logo ?? ''}
                alt={`${project.name} logo`}
                width={20}
                height={20}
                className='shrink-0 rounded ring-1 ring-border/50'
                fallback={
                  <div className='flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border/50'>
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                }
              />
              <span className='truncate text-sm text-foreground/80'>
                {project.name}
              </span>
              {project.category && (
                <Badge
                  variant='secondary'
                  className='ml-auto shrink-0 text-[10px]'
                >
                  {project.category}
                </Badge>
              )}
              {project.website && (
                <ExternalLinkIcon className='size-3 shrink-0 text-muted-foreground' />
              )}
            </>
          );

          const rowClassName = 'flex items-center gap-2 rounded-lg px-2 py-1';

          return project.website ? (
            <Link
              key={project.id}
              href={project.website}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                rowClassName,
                'transition-colors hover:bg-muted/50',
              )}
            >
              {row}
            </Link>
          ) : (
            <div key={project.id} className={rowClassName}>
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OrgInfoCard = ({
  organization,
  hideJobsButton,
}: OrgInfoCardProps) => {
  const {
    name,
    href,
    websiteUrl,
    location,
    logo,
    employeeCount,
    summary,
    description,
    socials,
    projects,
    fundingRounds,
    investors,
  } = organization;

  const hasAboutSection = !!description && description !== summary;

  return (
    <div className='space-y-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <div className='flex items-center gap-3'>
        <ImageWithFallback
          src={logo ?? ''}
          alt={`${name} logo`}
          width={40}
          height={40}
          className='shrink-0 rounded-lg ring-1 ring-border/50'
          fallback={
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-lg',
                'bg-linear-to-br from-muted to-muted/50',
                'text-sm font-medium text-muted-foreground',
                'ring-1 ring-border/50',
              )}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          }
        />
        <div className='flex items-center gap-2'>
          <span className='font-medium text-foreground'>{name}</span>
          {websiteUrl && (
            <Link
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Visit ${name} website`}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <ExternalLinkIcon className='size-3.5' />
            </Link>
          )}
        </div>
      </div>

      {summary && (
        <p className='text-sm leading-relaxed text-muted-foreground'>
          {summary}
        </p>
      )}

      {socials && <OrgSocials name={name} socials={socials} />}

      <div className='space-y-2'>
        {location && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MapPinIcon className='size-4' />
            <span>{location}</span>
          </div>
        )}
        {employeeCount && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <UsersIcon className='size-4' />
            <span>{employeeCount} Employees</span>
          </div>
        )}
      </div>

      {fundingRounds.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground'>Funding</p>
          <div className='flex flex-wrap gap-1.5'>
            {fundingRounds.slice(0, 3).map((round) => {
              const label = round.amount
                ? `${round.roundName} (${round.amount})`
                : round.roundName;

              return round.href ? (
                <Badge
                  key={`${round.roundName}-${round.date}`}
                  variant='secondary'
                  className='py-1 text-foreground/70 hover:text-foreground'
                >
                  <LinkWithLoader href={round.href}>{label}</LinkWithLoader>
                </Badge>
              ) : (
                <Badge key={round.roundName} variant='secondary'>
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {investors.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground'>Investors</p>
          <div className='flex flex-wrap gap-1.5'>
            {investors.slice(0, 5).map((investor) => (
              <Badge
                key={investor.name}
                variant='secondary'
                className='py-1 text-foreground/70 hover:text-foreground'
                asChild
              >
                <LinkWithLoader href={investor.href}>
                  {investor.name}
                </LinkWithLoader>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <OrgProjects projects={projects} />

      {hasAboutSection && (
        <details className='group'>
          <summary
            className={cn(
              'inline-flex cursor-pointer list-none items-center gap-1',
              'text-xs text-muted-foreground',
              'transition-colors duration-150 hover:text-foreground',
              '[&::-webkit-details-marker]:hidden',
            )}
          >
            <ChevronRightIcon
              className='size-3.5 transition-transform duration-200 group-open:rotate-90'
              aria-hidden='true'
            />
            {`About ${name}`}
          </summary>
          <p className='mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground'>
            {description}
          </p>
        </details>
      )}

      {!hideJobsButton && (
        <Button variant='secondary' asChild className='w-full'>
          <LinkWithLoader href={href}>View jobs by {name}</LinkWithLoader>
        </Button>
      )}
    </div>
  );
};
