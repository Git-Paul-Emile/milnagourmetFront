import React from 'react';
import { DashboardStats } from './analyticsTypes';

interface IngredientAnalysisProps {
  stats: DashboardStats;
}

function IngredientList({
  title,
  data,
  color
}: {
  title: string;
  data: Array<{ name: string; count: number }>;
  color: string;
}) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-16 bg-${color.split('-')[1]}-100 rounded-full h-2`}>
                <div
                  className={`bg-${color.split('-')[1]}-500 h-2 rounded-full`}
                  style={{
                    width: `${data.length > 0 ? (item.count / data[0].count) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm font-semibold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IngredientAnalysis({ stats }: IngredientAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <IngredientList
        title="Analyse des fruits"
        data={stats.topFruits}
        color="text-orange-700"
      />
      <IngredientList
        title="Analyse des sauces"
        data={stats.topSauces}
        color="text-blue-700"
      />
      <IngredientList
        title="Analyse des céréales"
        data={stats.topCereales}
        color="text-purple-700"
      />
    </div>
  );
}