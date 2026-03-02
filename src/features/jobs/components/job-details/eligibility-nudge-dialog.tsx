'use client';

import Link from 'next/link';
import { FileTextIcon, LinkIcon, UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MissingItem } from '@/features/jobs/apply-constants';

interface EligibilityNudgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  missing: MissingItem[];
}

const MISSING_ITEM_CONFIG: Record<
  MissingItem,
  { icon: React.ElementType; label: string; description: string }
> = {
  resume: {
    icon: FileTextIcon,
    label: 'Resume',
    description: 'Upload your resume so employers can review your experience',
  },
  socials: {
    icon: LinkIcon,
    label: 'Social Profiles',
    description:
      'Add your social profiles (GitHub, LinkedIn, etc.) to showcase your work',
  },
  linked_accounts: {
    icon: UsersIcon,
    label: 'Linked Accounts',
    description: 'Link your web3 accounts to verify your on-chain activity',
  },
};

export const EligibilityNudgeDialog = ({
  isOpen,
  onOpenChange,
  missing,
}: EligibilityNudgeDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-md'>
      <DialogHeader>
        <DialogTitle>Almost there!</DialogTitle>
        <DialogDescription>
          Complete your profile to apply for this job. You&apos;re just a few
          steps away.
        </DialogDescription>
      </DialogHeader>

      <ul className='space-y-4'>
        {missing.map((item) => {
          const { icon: Icon, label, description } = MISSING_ITEM_CONFIG[item];
          return (
            <li key={item} className='flex items-start gap-3'>
              <div className='mt-0.5 rounded-md bg-muted p-2'>
                <Icon className='size-4 text-muted-foreground' />
              </div>
              <div className='min-w-0'>
                <p className='text-sm font-medium'>{label}</p>
                <p className='text-sm text-muted-foreground'>{description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <DialogFooter>
        <Button asChild className='w-full'>
          <Link href='/profile'>Go to Profile</Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
