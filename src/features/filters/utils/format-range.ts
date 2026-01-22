const DEFAULT_LOCALE = 'en-US';

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);

/**
 * Format a range value with prefix
 * @example formatRangeValue(50000, '$') => "$50,000"
 * @example formatRangeValue(50000, null) => "50,000"
 */
export const formatRangeValue = (
  value: number,
  prefix: string | null | undefined,
): string => {
  const formatted = numberFormatter.format(value);
  return prefix ? `${prefix}${formatted}` : formatted;
};

/**
 * Format a range value in abbreviated form
 * @example formatRangeValueShort(50000, '$') => "$50K"
 * @example formatRangeValueShort(1500000, '$') => "$1.5M"
 * @example formatRangeValueShort(500, null) => "500"
 */
export const formatRangeValueShort = (
  value: number,
  prefix: string | null | undefined,
): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  let formatted: string;

  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    formatted = `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    const thousands = absValue / 1_000;
    formatted = `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  } else {
    formatted = absValue.toString();
  }

  const prefixStr = prefix ?? '';
  return `${sign}${prefixStr}${formatted}`;
};

/**
 * Calculate smart slider step based on range
 * @example calculateSliderStep(0, 100) => 1
 * @example calculateSliderStep(0, 1000) => 10
 * @example calculateSliderStep(0, 200000) => 1000
 */
export const calculateSliderStep = (min: number, max: number): number => {
  const range = Math.abs(max - min);

  if (range < 100) return 1;
  if (range < 1_000) return 10;
  if (range < 10_000) return 100;
  if (range < 100_000) return 1_000;
  return 5_000;
};

/**
 * Round a value to a nice number (nearest step)
 * Handles cases where API min is 1, causing values like 55001 instead of 55000
 * @example roundToNiceNumber(55001, 1000) => 55000
 * @example roundToNiceNumber(300001, 1000) => 300000
 */
export const roundToNiceNumber = (value: number, step: number): number => {
  return Math.round(value / step) * step;
};
