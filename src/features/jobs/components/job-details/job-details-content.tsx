import {
  type JobDetailsSchema,
  type JobTagSchema,
} from '@/features/jobs/schemas';
import {
  BulletSection,
  DescriptionSection,
} from '@/components/content-sections';
import { JobDetailsSkills } from './job-details-skills';

interface JobDetailsContentProps {
  job: JobDetailsSchema;
  tags: JobTagSchema[];
}

export const JobDetailsContent = ({ job, tags }: JobDetailsContentProps) => {
  const { description, requirements, responsibilities, benefits } = job;

  const bulletSections = [
    { title: 'Requirements', items: requirements },
    { title: 'Responsibilities', items: responsibilities },
    { title: 'Benefits', items: benefits },
  ];

  return (
    <div className='mt-8 space-y-8'>
      {description && (
        <DescriptionSection title='About the Role' description={description} />
      )}

      {bulletSections.map(({ title, items }) => (
        <BulletSection key={title} title={title} items={items} />
      ))}

      <JobDetailsSkills tags={tags} />
    </div>
  );
};
