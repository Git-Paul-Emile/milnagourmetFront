import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isChristmasTheme?: boolean;
}

export function TestimonialCard({ testimonial, index, isChristmasTheme = false }: TestimonialCardProps) {
  return (
    <div
      className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={cn(
          'rounded-xl p-6 border h-full',
          'hover-lift transition-all duration-300',
          'relative',
          isChristmasTheme
            ? 'bg-[rgba(255,255,255,0.1)] border-[rgba(255,215,0,0.3)] backdrop-blur-sm'
            : 'bg-card border-border'
        )}
      >
        {/* Quote icon */}
        <Quote className={cn("absolute top-4 right-4 h-8 w-8", isChristmasTheme ? "text-white/20" : "text-primary/20")} />

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", isChristmasTheme ? "fill-[#FFD700] text-[#FFD700]" : "fill-primary text-primary")} />
          ))}
        </div>

        {/* Comment */}
        <p className={cn("text-sm leading-relaxed mb-4 line-clamp-4", isChristmasTheme ? "text-white" : "text-muted-foreground")} style={{ maxHeight: '4.5rem' }}>
          "{testimonial.comment}"
        </p>

        {/* Author */}
        <div className={cn("flex items-center space-x-3 pt-4 border-t", isChristmasTheme ? "border-white/20" : "border-border")}>
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={cn("w-10 rounded-full flex items-center justify-center", isChristmasTheme ? "bg-white/20" : "bg-gradient-primary")}>
              <span className={cn("font-semibold text-sm", isChristmasTheme ? "text-white" : "text-primary-foreground")}>
                {testimonial.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className={cn("font-semibold text-sm", isChristmasTheme ? "text-white" : "text-foreground")}>
              {testimonial.name}
            </div>
            <div className={cn("text-xs", isChristmasTheme ? "text-white/70" : "text-muted-foreground")}>
              {testimonial.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}