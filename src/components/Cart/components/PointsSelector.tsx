import React, { useState } from 'react';
import { Gift, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsSelectorProps {
  availablePoints: number;
  currentTotal: number;
  onPointsChange: (pointsUsed: number) => void;
  conversionRate?: number; // Points to FCFA conversion rate (default: 1 point = 1 FCFA)
}

/**
 * Component for selecting loyalty points to use in the cart
 * Displays available points and calculates the discount
 */
export function PointsSelector({
  availablePoints,
  currentTotal,
  onPointsChange,
  conversionRate = 1
}: PointsSelectorProps) {
  const [pointsToUse, setPointsToUse] = useState(0);

  // Calculate max usable points (limited by both available and total amount)
  const maxUsablePoints = Math.min(
    Math.floor(availablePoints),
    Math.floor(currentTotal / conversionRate)
  );

  // Calculate discount amount
  const discountAmount = pointsToUse * conversionRate;


  const handlePointsChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, maxUsablePoints));
    setPointsToUse(clamped);
    onPointsChange(clamped);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePointsChange(parseInt(e.target.value, 10));
  };


  // Check if user has minimum points required (100 points)
  const MIN_POINTS_REQUIRED = 100;
  if (availablePoints < MIN_POINTS_REQUIRED) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 space-y-4 border border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Utiliser mes points de fidélité</h3>
        </div>
        <div className="text-sm font-bold text-primary">
          {availablePoints.toFixed(0)} points
        </div>
      </div>

      {/* Points Slider */}
      {maxUsablePoints > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Points à utiliser: {pointsToUse}
            </label>
            <span className="text-xs text-muted-foreground">
              Max: {Math.floor(maxUsablePoints)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={maxUsablePoints}
            value={pointsToUse}
            onChange={handleSliderChange}
            className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-primary slider-thumb"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{Math.floor(maxUsablePoints)}</span>
          </div>
        </div>
      )}

      {/* Discount Summary */}
      {pointsToUse > 0 && (
        <div className="bg-background rounded p-3 border border-primary/30 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Points utilisés:</span>
            <span className="font-medium">{pointsToUse.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-border pt-2">
            <span className="text-muted-foreground">Réduction:</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              -{discountAmount.toFixed(0)} FCFA
            </span>
          </div>
        </div>
      )}

      {/* No Points Button */}
      {pointsToUse > 0 && (
        <button
          onClick={() => handlePointsChange(0)}
          className="w-full py-2 px-3 text-sm text-muted-foreground hover:text-destructive transition-colors border border-border rounded hover:border-destructive"
        >
          Ne pas utiliser de points
        </button>
      )}
    </div>
  );
}
