import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { LOYALTY_MIN_POINTS, LOYALTY_POINT_VALUE_CFA } from '@/constants/loyalty';

interface PointsSelectorProps {
  availablePoints: number;
  currentTotal: number;
  onPointsChange: (pointsUsed: number) => void;
}

const MIN_POINTS_REQUIRED = LOYALTY_MIN_POINTS;

/**
 * Sélection des points de fidélité dans le panier (min. 100 points).
 * Le maximum est plafonné au montant de la commande : au-delà, les points
 * ne serviraient à rien (le serveur applique le même plafond).
 */
export function PointsSelector({
  availablePoints,
  currentTotal,
  onPointsChange,
}: PointsSelectorProps) {
  const [pointsToUse, setPointsToUse] = useState(0);

  const maxUsablePoints = Math.min(
    Math.floor(availablePoints),
    Math.ceil(currentTotal / LOYALTY_POINT_VALUE_CFA)
  );
  const discountAmount = pointsToUse * LOYALTY_POINT_VALUE_CFA;

  const handleActivate = () => {
    setPointsToUse(MIN_POINTS_REQUIRED);
    onPointsChange(MIN_POINTS_REQUIRED);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPointsToUse(value);
    onPointsChange(value);
  };

  const handleCancel = () => {
    setPointsToUse(0);
    onPointsChange(0);
  };

  if (maxUsablePoints < MIN_POINTS_REQUIRED) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 space-y-4 border border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Points de fidélité</h3>
        </div>
        <div className="text-sm font-bold text-primary">
          {availablePoints.toFixed(0)} pts disponibles
        </div>
      </div>

      {pointsToUse === 0 ? (
        /* Not using points yet */
        <button
          onClick={handleActivate}
          className="w-full py-2 px-3 text-sm font-medium text-foreground border border-button-border/40 rounded hover:border-transparent hover:bg-button-hover hover:text-button-hover-foreground transition-colors"
        >
          Utiliser mes points (min. {MIN_POINTS_REQUIRED} pts)
        </button>
      ) : (
        /* Slider active */
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Points à utiliser : <span className="text-foreground font-bold">{pointsToUse}</span>
              </label>
              <span className="text-xs text-muted-foreground">
                Max : {maxUsablePoints}
              </span>
            </div>

            <input
              type="range"
              min={MIN_POINTS_REQUIRED}
              max={maxUsablePoints}
              value={pointsToUse}
              onChange={handleSliderChange}
              className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-primary slider-thumb"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_POINTS_REQUIRED} pts</span>
              <span>{maxUsablePoints} pts</span>
            </div>
          </div>

          {/* Discount Summary */}
          <div className="bg-background rounded p-3 border border-primary/30 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Points utilisés :</span>
              <span className="font-medium">{pointsToUse}</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border pt-2">
              <span className="text-muted-foreground">Réduction :</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                -{discountAmount.toFixed(0)} FCFA
              </span>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="w-full py-2 px-3 text-sm text-muted-foreground hover:text-destructive transition-colors border border-border rounded hover:border-destructive"
          >
            Ne pas utiliser de points
          </button>
        </>
      )}
    </div>
  );
}
