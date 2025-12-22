import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { TimeRange, MetricType } from './analyticsTypes';

interface AnalyticsControlsProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  metricType: MetricType;
  setMetricType: (type: MetricType) => void;
}

export function AnalyticsControls({
  timeRange,
  setTimeRange,
  metricType,
  setMetricType,
}: AnalyticsControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Période:</span>
        </div>
        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 jours' },
            { value: '30d', label: '30 jours' },
            { value: '90d', label: '90 jours' },
            { value: '1y', label: '1 an' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setTimeRange(period.value as TimeRange)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === period.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={metricType}
          onChange={(e) => setMetricType(e.target.value as MetricType)}
          className="px-3 py-1 border border-border rounded-lg text-sm"
        >
          <option value="revenue">Revenus</option>
          <option value="orders">Commandes</option>
          <option value="customers">Clients</option>
        </select>
      </div>
    </div>
  );
}