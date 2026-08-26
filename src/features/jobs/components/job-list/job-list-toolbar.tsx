interface Props {
  total?: number;
  children?: React.ReactNode;
}

const jobCount = new Intl.NumberFormat('en-US');

export const JobListToolbar = ({ total, children }: Props) => (
  <div
    className='mb-4 flex min-h-9 items-center justify-between gap-3 lg:hidden'
    data-testid='mobile-job-list-toolbar'
  >
    <p className='min-w-0 text-sm text-muted-foreground' aria-live='polite'>
      {total === undefined ? (
        'Loading jobs…'
      ) : (
        <>
          <span className='font-medium text-foreground'>
            {jobCount.format(total)}
          </span>{' '}
          {total === 1 ? 'open job' : 'open jobs'}
        </>
      )}
    </p>
    <div className='flex shrink-0 items-center gap-2'>{children}</div>
  </div>
);
