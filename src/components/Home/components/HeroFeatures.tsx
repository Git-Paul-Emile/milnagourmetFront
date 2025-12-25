import { HeroFeature } from '@/types';
import { cn } from '@/lib/utils';

interface HeroFeaturesProps {
  features: HeroFeature[];
  isChristmasTheme?: boolean;
  isNewYearTheme?: boolean;
}

export function HeroFeatures({ features, isChristmasTheme = false, isNewYearTheme = false }: HeroFeaturesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg p-4">
          <div>
            <h3 className={cn(
              "font-semibold",
              isNewYearTheme ? "text-[#FFD700]" : "text-foreground"
            )}>{feature.title}</h3>
            <p className={`text-sm ${isNewYearTheme ? "text-[#E8E8E8]" : "text-muted-foreground"}`}>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}