import { cn } from '@/lib/utils';
import {
  type JobDetailsSchema,
  type JobTagSchema,
} from '@/features/jobs/schemas';
import { JobDetailsSkills } from './job-details-skills';

interface JobDetailsContentProps {
  job: JobDetailsSchema;
  tags: JobTagSchema[];
}

export const JobDetailsContent = ({ job, tags }: JobDetailsContentProps) => {
  const { description, requirements, responsibilities, benefits } = job;

  return (
    <div className='mt-6 space-y-6'>
      {description && (
        <section>
          <h2 className='mb-3 text-sm font-medium'>About the Role</h2>
          <div
            className={cn(
              'text-sm text-muted-foreground',
              '[&>p]:mb-3 [&>p]:leading-relaxed',
              '[&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5',
              '[&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5',
            )}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>
      )}

      {requirements.length > 0 && (
        <section>
          <h2 className='mb-3 text-sm font-medium'>Requirements</h2>
          <ul className='space-y-2'>
            {requirements.map((req, index) => (
              <li
                key={index}
                className='flex items-start gap-2 text-sm text-muted-foreground'
              >
                <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {responsibilities.length > 0 && (
        <section>
          <h2 className='mb-3 text-sm font-medium'>Responsibilities</h2>
          <ul className='space-y-2'>
            {responsibilities.map((resp, index) => (
              <li
                key={index}
                className='flex items-start gap-2 text-sm text-muted-foreground'
              >
                <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {benefits.length > 0 && (
        <section>
          <h2 className='mb-3 text-sm font-medium'>Benefits</h2>
          <ul className='space-y-2'>
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className='flex items-start gap-2 text-sm text-muted-foreground'
              >
                <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <JobDetailsSkills tags={tags} />
    </div>
  );
};
