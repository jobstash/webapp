import type { JobMarketMomentum } from '../schemas';

export const compactNumber = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value >= 1_000 ? 1 : 0,
  }).format(value);

export const monthlySalary = (value: number | null): string =>
  value === null
    ? 'Not enough salary data'
    : `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value)}/mo`;

export const momentumLabel = (momentum: JobMarketMomentum): string => {
  if (momentum.direction === 'new') return 'NEW';
  if (momentum.direction === 'insufficient') return 'Low activity';
  const value = momentum.percentChange ?? 0;
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const relativeMomentumLabel = (momentum: JobMarketMomentum): string => {
  const value = momentum.marketRelativeScore;
  if (value === null) return momentumLabel(momentum);
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}% vs market`;
};

export const percentLabel = (value: number | null): string =>
  value === null
    ? 'Not enough evidence'
    : `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const momentumTone = (
  momentum: JobMarketMomentum,
): 'positive' | 'negative' | 'neutral' => {
  if (momentum.direction === 'up' || momentum.direction === 'new') {
    return 'positive';
  }
  if (momentum.direction === 'down') return 'negative';
  return 'neutral';
};
