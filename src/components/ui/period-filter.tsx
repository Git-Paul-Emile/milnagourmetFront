import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

interface PeriodFilterProps {
  value: 'today' | 'week' | 'month' | 'year' | 'all';
  onChange: (period: 'today' | 'week' | 'month' | 'year' | 'all') => void;
  className?: string;
}

export function PeriodFilter({ value, onChange, className = '' }: PeriodFilterProps) {
  const options = [
    { value: 'today', label: 'Aujourd\'hui', icon: Clock },
    { value: 'week', label: 'Cette semaine', icon: Calendar },
    { value: 'month', label: 'Ce mois', icon: Calendar },
    { value: 'year', label: 'Cette année', icon: Calendar },
    { value: 'all', label: 'Toutes les périodes', icon: Calendar },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">Période:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}