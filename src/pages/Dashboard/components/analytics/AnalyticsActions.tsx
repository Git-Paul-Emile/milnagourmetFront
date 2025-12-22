import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface AnalyticsActionsProps {
  onExportReport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AnalyticsActions({ onExportReport, onRefresh, isRefreshing = false }: AnalyticsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>Actualiser</span>
      </button>
      <button
        onClick={onExportReport}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors order-2 sm:order-1"
      >
        <Download className="h-4 w-4" />
        <span>Exporter le rapport</span>
      </button>
    </div>
  );
}