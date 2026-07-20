import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroBadgeProps {
  badge: string;
}

export function HeroBadge({ badge }: HeroBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 animate-fade-in-up mx-auto lg:mx-0",
      "bg-primary/10 text-primary")}>
      <Star className="h-4 w-4 fill-current" />
      <span className="text-sm font-medium">{badge}</span>
    </div>
  );
}