interface InfoCardProps {
  title: string;
  description: string;
  cta: {
    text: string;
    href: string;
  };
}

const InfoCard = ({ title, description, cta }: InfoCardProps) => {
  return (
    <div className="p-4 border flex flex-col gap-4">
      <p>{title}</p>
      <p>{description}</p>
      <a href={cta.href}>{cta.text}</a>
    </div>
  );
};

const INFO_CARDS: InfoCardProps[] = [
  {
    title: 'Post a Job',
    description: 'Posting your job on JobStash is completely free, giving you access to a wide network of talented candidates at no cost. Simply verify your organization and start listing your job openings right away. If you want to increase visibility, you can choose to feature your job for $300 per week, which includes homepage placement, crossposting, and custom Telegram stories to attract more applicants.',
    cta: {
      text: 'Post Your Job for FREE',
      href: '/post-job',
    },
  },
  {
    title: 'Services for Employers',
    description: 'Use our promotional services to increase your reach up to 5x. We also offer services for small teams which get buried in candidates want to commit to a full-time recruiter. Our Applicant Tracking Service (ATS) is designed to help you streamline your hiring process and connect with verified, crypto-native talent. Additionally, our candidate report service offers you insight into the truthfulness of a technical candidate resume, within seconds, at a price anyone can afford.',
    cta: {
      text: 'Streamline Hiring Process',
      href: '/employers',
    },
  },
];

export const InfoSection = () => {
  return (
    <div className="space-y-20">
      <div className="flex gap-8">
        {INFO_CARDS.map(({ title, description, cta }) => (
          <InfoCard key={title} title={title} description={description} cta={cta} />
        ))}
      </div>

      <div className="border p-4 flex justify-between">
        <div>
          <span>
            Did you Hire or Get Hired Using JobStash ?
          </span>
          <span>
            Drop us a message and tell us how it went!
          </span>
        </div>
        <div>
          <button type="button">DM us your story</button>
        </div>
      </div>
    </div>
  );
};
