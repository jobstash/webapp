'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import {
  BarChart,
  LineChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts';
import {
  AriaComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { TooltipComponentOption } from 'echarts/components';

import { cn } from '@/lib/utils';

const containedTooltip = (tooltip: TooltipComponentOption) => ({
  ...tooltip,
  confine: true,
  extraCssText: `${tooltip.extraCssText ?? ''};max-width:calc(100% - 16px);box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;`,
});

echarts.use([
  AriaComponent,
  BarChart,
  CanvasRenderer,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  ScatterChart,
  TooltipComponent,
  TreemapChart,
]);

interface Props {
  option: EChartsCoreOption;
  className?: string;
  ariaLabel: string;
  onSelect?: (data: Record<string, unknown>) => void;
}

export const FlintEChart = ({
  option,
  className,
  ariaLabel,
  onSelect,
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const chart = echarts.init(element, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(
      {
        ...option,
        tooltip: Array.isArray(option.tooltip)
          ? option.tooltip.map(containedTooltip)
          : containedTooltip(option.tooltip ?? {}),
      },
      { notMerge: true },
    );
  }, [option]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !onSelect) return;
    const handleSelect = (event: { data?: unknown }) => {
      if (event.data && typeof event.data === 'object') {
        onSelect(event.data as Record<string, unknown>);
      }
    };
    chart.on('click', handleSelect);
    return () => {
      chart.off('click', handleSelect);
    };
  }, [onSelect]);

  return (
    <div
      ref={elementRef}
      // The canvas must follow the available width, not set a grid's minimum width.
      className={cn('relative w-full min-w-0 [contain:inline-size]', className)}
      role='img'
      aria-label={ariaLabel}
    />
  );
};
