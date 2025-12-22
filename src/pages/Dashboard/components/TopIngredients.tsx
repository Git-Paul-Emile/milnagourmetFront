import React from 'react';
import { Apple, Cookie, Wheat, LucideIcon } from 'lucide-react';
import { DashboardStats } from './types';

interface TopIngredientsProps {
  stats: DashboardStats;
}

interface IngredientItem {
  name: string;
  count: number;
}

interface IngredientSectionProps {
  title: string;
  icon: LucideIcon;
  color: string;
  data: IngredientItem[];
}

const IngredientSection = ({ title, icon: Icon, color, data }: IngredientSectionProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
      <Icon className={`h-5 w-5 text-${color}-500`} />
      <span>{title}</span>
    </h3>
    {data.length > 0 ? (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className={`flex items-center justify-between p-2 bg-${color}-50 rounded-lg`}>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-6 h-6 bg-${color}-100 text-${color}-800 rounded-full text-xs font-bold`}>
                {index + 1}
              </div>
              <span className="font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.count} commandes</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-center py-4">Aucune donnée disponible</p>
    )}
  </div>
);

const ingredientSections = [
  {
    title: 'Top fruits populaires',
    icon: Apple,
    color: 'orange',
    getData: (stats: DashboardStats) => stats.topFruits,
  },
  {
    title: 'Top sauces populaires',
    icon: Cookie,
    color: 'blue',
    getData: (stats: DashboardStats) => stats.topSauces,
  },
  {
    title: 'Top céréales populaires',
    icon: Wheat,
    color: 'purple',
    getData: (stats: DashboardStats) => stats.topCereales,
  },
];

export const TopIngredients = ({ stats }: TopIngredientsProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {ingredientSections.map((section) => (
      <IngredientSection
        key={section.title}
        title={section.title}
        icon={section.icon}
        color={section.color}
        data={section.getData(stats)}
      />
    ))}
  </div>
);