import { useState } from 'react';
import { TimeRange, MetricType } from './analyticsTypes';

export function useAnalyticsState() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [metricType, setMetricType] = useState<MetricType>('revenue');

  return {
    timeRange,
    setTimeRange,
    metricType,
    setMetricType,
  };
}