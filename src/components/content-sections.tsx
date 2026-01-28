interface DescriptionSectionProps {
  title: string;
  description: string;
}

export const DescriptionSection = ({
  title,
  description,
}: DescriptionSectionProps) => (
  <section>
    <h2 className='mb-4 text-lg font-semibold'>{title}</h2>
    <p className='text-base leading-relaxed text-foreground/60'>
      {description}
    </p>
  </section>
);

interface BulletSectionProps {
  title: string;
  items: string[];
}

export const BulletSection = ({ title, items }: BulletSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className='mb-4 text-lg font-semibold'>{title}</h2>
      <ul className='space-y-2 pl-1'>
        {items.map((item, index) => (
          <li
            key={index}
            className='flex items-start gap-2 text-base text-foreground/60'
          >
            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
            <span className='leading-relaxed'>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
