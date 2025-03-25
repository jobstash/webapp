import { cva, type VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils/cn';

import { Avatar, AvatarFallback, AvatarImage } from '@/lib/shared/ui/base/avatar';

/**
 * Variants for the LogoTitle component
 */
const logoTitleVariants = cva('flex items-center', {
  variants: {
    size: {
      xs: 'gap-2',
      sm: 'gap-2.5',
      md: 'gap-3',
      lg: 'gap-3',
      xl: 'gap-4',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

/**
 * Size variants for the avatar
 */
const avatarVariants = cva('border border-muted bg-white/5 shadow-sm', {
  variants: {
    size: {
      xs: 'size-8',
      sm: 'size-10',
      md: 'size-11',
      lg: 'size-12',
      xl: 'size-14',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

/**
 * Size variants for the title
 */
const titleVariants = cva('leading-none font-bold', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

/**
 * Size variants for the subtitle
 */
const subtitleVariants = cva('leading-none text-white/60', {
  variants: {
    size: {
      xs: 'text-[10px]',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

/**
 * Props for the LogoTitle component
 * @property {string} [src] - URL of the logo/avatar image
 * @property {ReactNode} title - Main content to display
 * @property {string} [fallbackTitle] - String to use for avatar fallback and identicon when title is a ReactNode
 * @property {string} [subtitle] - Secondary text to display below the title
 * @property {boolean} [useIdenticon] - When true and src is undefined, uses identicon instead of initials
 * @property {object} [classNames] - Custom class names for styling different parts of the component
 * @property {Size} [size] - Size variant of the component
 */
interface Props extends VariantProps<typeof logoTitleVariants> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  src?: string;
  classNames?: {
    container?: ClassValue;
    avatar?: ClassValue;
    title?: ClassValue;
    titleWrapper?: ClassValue;
    subtitle?: ClassValue;
  };
  isIdenticonFallback?: boolean;
}

const FALLBACK_TITLE = 'Unknown';

/**
 * Gets the fallback text from title by taking first letter of each word (max 2 words)
 */
const getFallbackText = (title: string) => {
  const words = title.split(' ');
  const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase());
  return initials.join('');
};

/**
 * Displays a logo/avatar with a title and optional subtitle
 *
 * Features:
 * - Shows an avatar with image or fallback initials
 * - Displays a title next to the avatar (supports both string and ReactNode)
 * - Optional subtitle below the title
 * - Highly customizable with classNames for each part
 * - Optional identicon fallback instead of initials
 * - Supports fallback text for ReactNode titles
 * - Supports different size variants (xs, sm, md, lg, xl)
 *
 * @example
 * ```tsx
 * // With string title
 * <LogoTitle
 *   src="/path/to/logo.png"
 *   title="Company Name"
 *   subtitle="Established 2024"
 *   useIdenticon
 *   size="lg"
 * />
 *
 * // With ReactNode title
 * <LogoTitle
 *   title={<span>Company <strong>Name</strong></span>}
 *   size="sm"
 * />
 * ```
 */
export const LogoTitle = (props: Props) => {
  const { src, title, subtitle = null, isIdenticonFallback, classNames, size } = props;

  const isStringTitle = typeof title === 'string';
  const titleText = isStringTitle ? title : FALLBACK_TITLE;
  const isStringSubtitle = typeof subtitle === 'string';

  return (
    <div
      className={cn('shrink-0 pr-4', logoTitleVariants({ size }), classNames?.container)}
    >
      <Avatar className={cn(avatarVariants({ size }), classNames?.avatar)}>
        <AvatarImage src={src} alt={titleText} />
        {!isIdenticonFallback && (
          <AvatarFallback>{getFallbackText(titleText)}</AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          'flex flex-col items-start justify-center',
          classNames?.titleWrapper,
        )}
      >
        {isStringTitle ? (
          <span className={cn(titleVariants({ size }), classNames?.title)}>{title}</span>
        ) : (
          <>{title}</>
        )}
        {isStringSubtitle ? (
          <span className={cn(subtitleVariants({ size }), classNames?.subtitle)}>
            {subtitle}
          </span>
        ) : (
          <>{subtitle}</>
        )}
      </div>
    </div>
  );
};
