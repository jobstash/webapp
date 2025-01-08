interface Props {
  param: string;
  items: {
    label: string;
    href: string;
  }[];
  counts: {
    jobs: number;
    organizations: number;
  };
}

export const JobSearchItems = ({ param, items, counts }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h2>
        Search Crypto Jobs by
        {' '}
        {param}
      </h2>
      <div className="flex gap-4 flex-wrap">
        {items.map(({ label, href }) => (
          <a key={href} href={href}>
            {label}
            {' '}
            Jobs in Crypto
          </a>
        ))}
      </div>
      <p>
        Browse
        {' '}
        {counts.jobs}
        {' '}
        crypto jobs at
        {counts.organizations}
        {' '}
        organizations. Filter the best remote crypto jobs by salary, location, and skills.
      </p>
      <a href="/jobs">Explore Crypto Jobs</a>
    </div>
  );
};
