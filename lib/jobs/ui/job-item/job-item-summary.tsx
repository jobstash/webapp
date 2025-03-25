import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Divider } from '@/lib/shared/ui/divider';

interface Props {
  summary: JobItemSchema['summary'];
}

export const JobItemSummary = ({ summary }: Props) => {
  if (!summary) return null;
  return (
    <>
      <Divider />
      <p className='text-sm text-muted-foreground'>{summary}</p>
    </>
  );
};
