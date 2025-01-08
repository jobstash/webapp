const TEXTS = [
  {
    title: 'Safety by Default',
    description: 'At JobStash we don\'t let random anons post jobs. Other Job Platforms allow to "post jobs" for payment, but we believe this creates perverse incentives. In contrast, we pull jobs from career pages of verified crypto organizations on a daily basis, and only include reputable companies in our index. This way you know you will never be sent to a fake recruiter and risk having your safety compromised.',
  },
  {
    title: 'Accurate data where it matters',
    description: 'We built Jobstash from the ground up leveraging AI to Structure Data so that jobposts can be presented in a concise, uniform and filterable way. We are able to present you datapoints about jobs that other platforms do not extract, and combine the information we have about jobs with data from DefiLlama and from De.Fi to give you a sense of the financials and safety of a protocol.',
  },
  {
    title: 'Shining Light on Great Applicants',
    description: 'In todays market condition successful job posts get hundreds if not thousands of job applicants, with a very low S/N ratio. We understand that crypto is different than other industries. High performance teams are built on trust, and we embrace this natively by surfacing applicants that are currently working in the industry or that are crypto adjacent, so that when you interview with JobStash, you know the person you\'re talking to is the real deal. Great talent has the best chance of being hired using JobStash.',
  },
  {
    title: 'No Middlemen',
    description: 'JobStash does not include jobs from agencies. We directly connect talent with the hiring managers, and provide data and ease of access to facilitate great talent introductions. We actively encourage people to introduce themselves via their trusted personal network, as we believe that crypto teams are built on reputation and trust.',
  },
  {
    title: 'We take the hard road',
    description: 'At JobStash we\'ve spent the past years obsessing over how to build an amazing experience for talent specifically in crypto. We have done crazy things, such as built data pipelines that consume literal years of compute time to import all of crypto GitHub, just to be able to detect if a user is actually part of an organization, as he may claim. See, in crypto you can\'t trust anybody. We take the same approach. We verify every single bit of data, and strive for accuracy and completeness. We don\'t simply operate as a job board. We are an intelligence hub for people operations in crypto, and base this on a foundation of rigorous data verification, comprehensive analytics, and deep insights into the Web3 talent landscape.',
  },
];

export const WhatSetUsApartSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2>What Sets Us Apart</h2>
      <div className="flex gap-4 flex-wrap">
        {TEXTS.map(({ title, description }) => (
          <div key={title} className="flex flex-col gap-4 border p-4">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
