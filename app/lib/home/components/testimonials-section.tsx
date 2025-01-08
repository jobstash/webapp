interface TestimonialProps {
  image: string;
  description: string;
  name: string;
  position: string;
  organization: {
    name: string;
    logo: string;
  };
}

const Testimonial = (props: TestimonialProps) => {
  const { image, description, name, position, organization } = props;
  return (
    <div className="flex flex-col gap-4">
      <img src={image} alt={name} />
      <p>{description}</p>
      <hr />
      <div>
        <p>{name}</p>
        <p>{position}</p>
      </div>
      <div className="flex gap-4">
        <img src={organization.logo} alt={organization.name} />
        <p>{organization.name}</p>
      </div>
    </div>
  );
};

const TESTIMONIALS: TestimonialProps[] = [
  {
    image: '/testimony-najdana-majors.png',
    description: 'One of our recent hires found the job through JobStash. If you are looking for your next opportunity, I highly recommend checking out their platform!',
    name: 'Najdana Majors',
    position: 'Talent, Everclear',
    organization: {
      name: 'Everclear',
      logo: '/testimony-everclear-org.jpeg',
    },
  },
  {
    image: '/testimony-ivan-gbi.jpg',
    description: 'JobStash supported us in finding new talent for Gearbox, and supported us in giving more exposure to our vacancies thanks to featuring, which got us way more inbound and ultimately a successful hire.',
    name: 'ivangbi',
    position: 'Core member, Gearbox DAO',
    organization: {
      name: 'Gearbox',
      logo: '/testimony-gearbox-org.png',
    },
  },
  {
    image: '/testimony-james.jpg',
    description: 'In a sea of job platforms, JobStash shines with its unique and uncomplicated approach to job aggregation and led by an authentic team that genuinely want to help match the best talent. Really cool UX and free!',
    name: 'James Glasscock',
    position: 'Head of Ecosystem, Reserve Protocol',
    organization: {
      name: 'Reserve',
      logo: '/testimony-reserve-org.svg',
    },
  },
];

export const TestimonialsSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <p>Testimonials</p>
      <p>Some of the best organizations have found talent using JobStash. Here's what they had to say</p>
      <div className="flex gap-4">
        {TESTIMONIALS.map(testimonial => (
          <Testimonial key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </div>
  );
};
