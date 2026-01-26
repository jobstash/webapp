'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallback: React.ReactNode;
}

export const ImageWithFallback = ({
  fallback,
  className,
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <Image
      alt={alt}
      className={cn(className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
