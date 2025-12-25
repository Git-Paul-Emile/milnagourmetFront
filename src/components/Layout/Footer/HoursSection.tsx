import React from 'react';
import { Clock } from 'lucide-react';
import { ContactInfo } from '@/types';
import { cn } from '@/lib/utils';

interface HoursSectionProps {
  contactInfo: ContactInfo | null;
  isChristmasTheme?: boolean;
}

export function HoursSection({ contactInfo, isChristmasTheme = false }: HoursSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold",
        "text-foreground"
      )}>Horaires</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Clock className={cn(
            "h-4 w-4",
            "text-primary"
          )} />
          <div className={cn(
            "text-sm",
            "text-muted-foreground"
          )}>
            {contactInfo?.hours ? (
              <>
                <div>Lundi - Vendredi: {contactInfo.hours.monday?.open} - {contactInfo.hours.monday?.close}</div>
                <div>Samedi: {contactInfo.hours.saturday?.open} - {contactInfo.hours.saturday?.close}</div>
                <div>Dimanche: {contactInfo.hours.sunday?.closed ? 'Fermé' : `${contactInfo.hours.sunday?.open} - ${contactInfo.hours.sunday?.close}`}</div>
              </>
            ) : (
              <>
                <div>Lundi - Vendredi: 08:00 - 20:00</div>
                <div>Samedi: 09:00 - 18:00</div>
                <div>Dimanche: Fermé</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}