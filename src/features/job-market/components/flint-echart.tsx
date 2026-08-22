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
    chartRef.current?.setOption(option, { notMerge: true });
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
      className={className}
      role='img'
      aria-label={ariaLabel}
    />
  );
};
