'use client';

import { useState } from 'react';

import { useProgress } from '@bprogress/next';
import { useQueryState } from 'nuqs';

import {
  calculateSliderStep,
  roundToNiceNumber,
} from '@/features/filters/utils';

interface UseRangeFilterStateProps {
  lowestParamKey: string;
  highestParamKey: string;
  defaultLowest: number;
  defaultHighest: number;
}

interface UseRangeFilterStateReturn {
  /** Current local values for the slider */
  localValues: [number, number];
  /** Rounded values for display (removes trailing 1s from API min) */
  displayValues: [number, number];
  /** Update local values (does not affect URL) */
  setLocalValues: (values: [number, number]) => void;
  /** Apply local values to URL params */
  apply: () => void;
  /** Reset local values to match URL params */
  reset: () => void;
  /** True if local values differ from URL values */
  hasChanges: boolean;
  /** True if the selected range is valid and can be applied */
  canApply: boolean;
}

const parseNumber = (value: string | null, fallback: number): number => {
  if (value === null) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const useRangeFilterState = ({
  lowestParamKey,
  highestParamKey,
  defaultLowest,
  defaultHighest,
}: UseRangeFilterStateProps): UseRangeFilterStateReturn => {
  const { start } = useProgress();

  const [lowestParam, setLowestParam] = useQueryState(lowestParamKey);
  const [highestParam, setHighestParam] = useQueryState(highestParamKey);
  const [, setPage] = useQueryState('page');

  const step = calculateSliderStep(defaultLowest, defaultHighest);

  const urlLowest = parseNumber(lowestParam, defaultLowest);
  const urlHighest = parseNumber(highestParam, defaultHighest);

  const [localValues, setLocalValues] = useState<[number, number]>([
    urlLowest,
    urlHighest,
  ]);

  const displayValues: [number, number] = [
    roundToNiceNumber(localValues[0], step),
    roundToNiceNumber(localValues[1], step),
  ];

  const roundedDefaultLowest = roundToNiceNumber(defaultLowest, step);
  const roundedDefaultHighest = roundToNiceNumber(defaultHighest, step);

  const hasChanges =
    localValues[0] !== urlLowest || localValues[1] !== urlHighest;

  // Valid range: min must be less than max
  const isValidRange = displayValues[0] < displayValues[1];

  // Full range: selecting the entire range is essentially "no filter"
  const isFullRange =
    displayValues[0] === roundedDefaultLowest &&
    displayValues[1] === roundedDefaultHighest;

  // Can apply when: has changes, valid range, and not selecting full range (no-op)
  const canApply = hasChanges && isValidRange && !isFullRange;

  const apply = (): void => {
    if (!canApply) return;
    start();
    setPage(null);
    setLowestParam(String(displayValues[0]));
    setHighestParam(String(displayValues[1]));
  };

  const reset = (): void => {
    setLocalValues([urlLowest, urlHighest]);
  };

  return {
    localValues,
    displayValues,
    setLocalValues,
    apply,
    reset,
    hasChanges,
    canApply,
  };
};
