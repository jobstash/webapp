import { JobListItemSchema } from '@/lib/jobs/core/schemas';

interface Props {
  job: JobListItemSchema;
}

export const JobListItem = ({ job }: Props) => {
  const { id, title, infoTags, tags } = job;

  return (
    <div className='flex w-full flex-col gap-4 rounded-3xl border border-neutral-600 p-6'>
      <p>{id}</p>
      <p>{title}</p>
      <pre>
        {JSON.stringify(
          infoTags.map((tag) => tag.label),
          undefined,
          '\t',
        )}
      </pre>
      <pre>
        {JSON.stringify(
          tags.map((tag) => tag.name),
          undefined,
          '\t',
        )}
      </pre>
    </div>
  );
};
