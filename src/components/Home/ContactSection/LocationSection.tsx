import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  address: string;
  isChristmasTheme?: boolean;
}

export function LocationSection({ address, isChristmasTheme = false }: LocationSectionProps) {
  return (
    <div className="lg:col-span-1">
      {/* Localisation */}
      <a href="https://urlr.me/RVykJH" target="_blank" rel="noopener noreferrer">
        <div className="p-4 bg-gradient-card rounded-xl border border-border">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Notre Adresse</h4>
              <p className="text-muted-foreground text-sm">
                {address}<br />
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}