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

export const shouldBypassImageOptimization = (
  src: ImageProps['src'],
): boolean => typeof src === 'string' && /^(?:https?:)?\/\//i.test(src.trim());

export const ImageWithFallback = ({
  fallback,
  className,
  alt,
  src,
  unoptimized,
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
      // Organization/project logos come from arbitrary third-party hosts.
      // Loading them directly keeps Google Favicons as the primary automatic
      // logo source while preventing 404s and redirects from consuming the
      // server-side Next image optimizer. The existing onError handler still
      // switches broken sources to the initials fallback.
      unoptimized={unoptimized ?? shouldBypassImageOptimization(src)}
      {...props}
    />
  );
};
