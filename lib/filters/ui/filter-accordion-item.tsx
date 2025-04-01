'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/shared/ui/base/accordion';

interface Props extends React.PropsWithChildren {
  label: string;
  className?: string;
}

export const FilterAccordionItem = ({ label, children, className }: Props) => {
  return (
    <AccordionItem value={label}>
      <AccordionTrigger>{label}</AccordionTrigger>
      <AccordionContent className={className}>{children}</AccordionContent>
    </AccordionItem>
  );
};
