import React from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingStars({ rating, onRatingChange }: RatingStarsProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <Star className="h-4 w-4" />
        <span>Note</span>
      </Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={cn(
                'h-6 w-6',
                star <= rating
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}