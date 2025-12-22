import { cn } from '@/lib/utils';

interface TestimonialsHeaderProps {
  isChristmasTheme?: boolean;
}

export function TestimonialsHeader({ isChristmasTheme = false }: TestimonialsHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        <span className={isChristmasTheme ? "text-white" : "text-foreground"}>Ce que disent nos </span>
        <span className={isChristmasTheme ? "text-[#FFD700]" : "bg-gradient-primary bg-clip-text text-transparent"}>Clients</span>
      </h2>
      <p className={cn("text-lg max-w-2xl mx-auto", isChristmasTheme ? "text-white" : "text-muted-foreground")}>
        Découvrez les avis authentiques de nos clients satisfaits qui font confiance
        à Milna Gourmet pour leurs moments gourmands.
      </p>
    </div>
  );
}