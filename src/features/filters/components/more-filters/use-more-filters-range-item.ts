import { useState, type TransitionStartFunction } from 'react';

import { useProgress } from '@bprogress/next';
import { useQueryState } from 'nuqs';

import type { RangeFilterConfig } from '@/features/filters/schemas';
import {
  calculateSliderStep,
  formatRangeValue,
  roundToNiceNumber,
} from '@/features/filters/utils';

interface Props {
  config: RangeFilterConfig;
  closeDropdown: () => void;
  startTransition: TransitionStartFunction;
}

export const useMoreFiltersRangeItem = ({
  config,
  closeDropdown,
  startTransition,
}: Props) => {
  const { start } = useProgress();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<[number, number]>([
    config.lowest.value,
    config.highest.value,
  ]);

  const [, setLowParam] = useQueryState(config.lowest.paramKey);
  const [, setHighParam] = useQueryState(config.highest.paramKey);
  const [, setPage] = useQueryState('page');

  const step = calculateSliderStep(config.lowest.value, config.highest.value);
  const roundedLow = roundToNiceNumber(value[0], step);
  const roundedHigh = roundToNiceNumber(value[1], step);

  const roundedDefaultLow = roundToNiceNumber(config.lowest.value, step);
  const roundedDefaultHigh = roundToNiceNumber(config.highest.value, step);

  const formattedLow = formatRangeValue(roundedLow, config.prefix);
  const formattedHigh = formatRangeValue(roundedHigh, config.prefix);

  // Valid range: min must be less than max
  const isValidRange = roundedLow < roundedHigh;

  // Full range: selecting the entire range is essentially "no filter"
  const isFullRange =
    roundedLow === roundedDefaultLow && roundedHigh === roundedDefaultHigh;

  const canApply = isValidRange && !isFullRange;

  const handleApply = () => {
    if (!canApply) return;
    start();
    setOpen(false);
    closeDropdown();
    startTransition(() => {
      setPage(null);
      setLowParam(String(roundedLow));
      setHighParam(String(roundedHigh));
    });
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    formattedLow,
    formattedHigh,
    canApply,
    handleApply,
  };
};
