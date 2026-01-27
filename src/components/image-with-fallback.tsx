'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallback: React.ReactNode;
}

const isValidImageSrc = (src: ImageProps['src']): boolean => {
  if (!src) return false;
  if (typeof src === 'string') return src.trim().length > 0;
  return true;
};

export const ImageWithFallback = ({
  fallback,
  className,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (!isValidImageSrc(src) || hasError) {
    return fallback;
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
