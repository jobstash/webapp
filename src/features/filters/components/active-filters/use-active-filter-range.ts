'use client';

import { useState, useTransition } from 'react';

import { useFilterQueryState } from '@/features/filters/hooks';
import { useRangeFilterState } from '@/features/filters/hooks/use-range-filter-state';
import type { RangeFilterConfig } from '@/features/filters/schemas';
import {
  calculateSliderStep,
  formatRangeValue,
  formatRangeValueShort,
} from '@/features/filters/utils';

interface UseActiveFilterRangeProps {
  config: RangeFilterConfig;
}

export const useActiveFilterRange = ({ config }: UseActiveFilterRangeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { localValues, displayValues, setLocalValues, apply, reset, canApply } =
    useRangeFilterState({
      lowestParamKey: config.lowest.paramKey,
      highestParamKey: config.highest.paramKey,
      defaultLowest: config.lowest.value,
      defaultHighest: config.highest.value,
    });

  const [, setLowestParam] = useFilterQueryState(config.lowest.paramKey);
  const [, setHighestParam] = useFilterQueryState(config.highest.paramKey);

  const step = calculateSliderStep(config.lowest.value, config.highest.value);

  const formattedMin = formatRangeValue(displayValues[0], config.prefix);
  const formattedMax = formatRangeValue(displayValues[1], config.prefix);

  const formattedMinShort = formatRangeValueShort(
    displayValues[0],
    config.prefix,
  );
  const formattedMaxShort = formatRangeValueShort(
    displayValues[1],
    config.prefix,
  );

  const triggerLabel = `${formattedMinShort} - ${formattedMaxShort}`;

  const handleApply = () => {
    setIsOpen(false);
    startTransition(() => {
      apply();
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    setIsOpen(open);
  };

  const handleClose = () => {
    startTransition(() => {
      setLowestParam(null);
      setHighestParam(null);
    });
  };

  return {
    isOpen,
    isPending,
    canApply,
    localValues,
    setLocalValues,
    step,
    formattedMin,
    formattedMax,
    triggerLabel,
    handleApply,
    handleOpenChange,
    handleClose,
  };
};
