'use client';

import { useRef } from 'react';

import { UploadCloud } from 'lucide-react';

import { cn } from '@/lib/shared/utils';

export const CVUploadCTA = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCTAClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // TODO: Implement actual file upload logic
    }
    // Reset file input to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <div className='mt-2 ml-0.5 flex items-center text-xs text-muted-foreground'>
      <span>Get personalized job matches. </span>
      <button
        type='button'
        onClick={handleCTAClick}
        className={cn(
          '-mt-0.5 ml-1',
          'inline-flex items-center gap-1',
          'cursor-pointer font-semibold underline underline-offset-2',
          'rounded-sm text-primary/80 transition-colors hover:text-primary/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        )}
      >
        <UploadCloud className='h-4 w-4' />
        Upload your CV
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept='.pdf,.doc,.docx,.txt' // Example accepted file types
      />
    </div>
  );
};
