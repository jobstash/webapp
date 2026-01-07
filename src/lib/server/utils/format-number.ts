import 'server-only';

const DEFAULT_LOCALE = 'en';
const DEFAULT_NOTATION = 'compact';

const NUM_FORMATTER = Intl.NumberFormat(DEFAULT_LOCALE, {
  notation: DEFAULT_NOTATION,
});

export const formatNumber = (num: number) => NUM_FORMATTER.format(num);
