import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
  valueColor?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, color, valueColor }: StatCardProps) => {
  const getTrendInfo = (trend: string) => {
    if (trend.startsWith('+')) {
      return { color: 'text-green-600', icon: TrendingUp };
    } else if (trend.startsWith('-')) {
      return { color: 'text-red-600', icon: TrendingDown };
    } else {
      return { color: 'text-muted-foreground', icon: TrendingUp };
    }
  };

  const trendInfo = trend ? getTrendInfo(trend) : null;

  return (
    <div className={cn('bg-card rounded-lg p-6 border border-border', color)}>
      <div>
           <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
          {trend && trendInfo && (
            <p className={cn('text-xs mt-1', trendInfo.color)}>
              <trendInfo.icon className="h-3 w-3 inline mr-1" />
              {trend}
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
  );
};