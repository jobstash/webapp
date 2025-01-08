import type { TagElement } from '~/lib/shared/core/types';

interface NewestJobCardProps {
  org: {
    title: string;
    logo: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
    tags: TagElement[];
  };
}

const NewestJobCard = ({ org, job }: NewestJobCardProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 border">
      <div className="flex gap-2">
        <img src={org.logo} alt={org.title} className="w-16 h-16" />
        <div>
          <p>{org.title}</p>
          <p>{job.title}</p>
        </div>
      </div>
      <p>{job.description}</p>
      <div className="flex gap-2">
        {job.tags.map(tag => (
          <span key={tag.text}>{tag.text}</span>
        ))}
      </div>
    </div>
  );
};

const dummyData: NewestJobCardProps[] = [
  {
    org: {
      title: 'Company A',
      logo: 'https://via.placeholder.com/64',
    },
    job: {
      id: '1',
      title: 'Job A',
      description: 'Job A Description',
      tags: [{ text: 'Tag A' }, { text: 'Tag B' }],
    },
  },
  {
    org: {
      title: 'Company B',
      logo: 'https://via.placeholder.com/64',
    },
    job: {
      id: '2',
      title: 'Job B',
      description: 'Job B Description',
      tags: [{ text: 'Tag C' }, { text: 'Tag D' }],
    },
  },
  {
    org: {
      title: 'Company C',
      logo: 'https://via.placeholder.com/64',
    },
    job: {
      id: '3',
      title: 'Job C',
      description: 'Job C Description',
      tags: [{ text: 'Tag E' }, { text: 'Tag F' }],
    },
  },
];

export const NewestJobsSection = () => {
  return (
    <div className="space-y-4">
      <p>Newest Jobs</p>
      <p>
        JobStash Curates Crypto Native Jobs Across the Entire Crypto Ecosystem, Powered by AI and Enhanced by Unique Data Insights—As a Public Good.
      </p>
      <div className="flex gap-4">
        {dummyData.map(data => (
          <NewestJobCard key={data.job.id} {...data} />
        ))}

      </div>
    </div>
  );
};
