import {
  type JobDetailsSchema,
  type JobTagSchema,
} from '@/features/jobs/schemas';
import {
  BulletSection,
  DescriptionSection,
} from '@/components/content-sections';
import { JobDetailsSkills } from './job-details-skills';
import { AvailabilityPills } from '@/features/jobs/components/availability-pills';

interface JobDetailsContentProps {
  job: JobDetailsSchema;
  tags: JobTagSchema[];
}

export const JobDetailsContent = ({ job, tags }: JobDetailsContentProps) => {
  const {
    description,
    requirements,
    responsibilities,
    benefits,
    hiringProcess,
  } = job;

  const bulletSections = [
    { title: 'Requirements', items: requirements },
    { title: 'Responsibilities', items: responsibilities },
    { title: 'Benefits', items: benefits },
  ];

  return (
    <div className='mt-6 space-y-6'>
      <JobDetailsSkills tags={tags} />

      {job.availability.length > 0 && (
        <section className='space-y-3'>
          <h2 className='text-lg font-semibold text-foreground'>
            Candidate Availability
          </h2>
          <AvailabilityPills items={job.availability} />
          <p className='text-xs text-muted-foreground'>
            Required and preferred rules are kept separate and reflect the
            wording in the original posting.
          </p>
        </section>
      )}

      {description && (
        <DescriptionSection title='About the Role' description={description} />
      )}

      {bulletSections.map(({ title, items }) => (
        <BulletSection key={title} title={title} items={items} />
      ))}

      {hiringProcess && (
        <DescriptionSection
          title='Hiring Process'
          description={hiringProcess}
        />
      )}
    </div>
  );
};
