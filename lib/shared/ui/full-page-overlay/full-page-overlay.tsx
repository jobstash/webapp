'use client';

import { useRef } from 'react';

import { useOverlay } from './use-overlay';

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const FullPageOverlay = ({ isOpen, onClose, children }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isActive } = useOverlay({ isOpen, onClose });

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-start justify-center bg-background'
    >
      {children}
    </div>
  );
};
