interface Props {
  name: string;
  description: string;
}

export const OrgAboutSection = ({ name, description }: Props) => (
  <section className='mx-auto w-full max-w-4xl px-4 py-8'>
    <h2 className='text-2xl font-semibold tracking-tight'>About {name}</h2>
    <p className='mt-4 leading-relaxed whitespace-pre-line text-muted-foreground'>
      {description}
    </p>
  </section>
);
