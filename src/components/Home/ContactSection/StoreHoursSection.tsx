import { Clock } from 'lucide-react';
import { useStoreHours } from '@/hooks/useStoreHours';
import { ContactSectionData } from '@/types';

interface StoreHoursSectionProps {
  storeHours: ContactSectionData['storeHours'];
}

export function StoreHoursSection({ storeHours }: StoreHoursSectionProps) {
  const storeStatus = useStoreHours();

  return (
    <div className="lg:col-span-1">
      <h3 className="text-xl font-semibold mb-6 text-[#212121]">Horaires d'Ouverture</h3>

      {/* Statut actuel */}
      <div className="p-4 rounded-xl mb-6 text-foreground">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-semibold">
            {storeStatus.isOpen ? 'Ouvert Maintenant' : 'Fermé'}
          </span>
        </div>
        <p className="text-sm opacity-90">{storeStatus.nextChange}</p>
      </div>

      {/* Horaires détaillés */}
      <div className="space-y-3">
        {storeHours.map((schedule) => (
          <div key={schedule.day} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
            <span className="font-medium text-foreground">{schedule.day}</span>
            <span className="text-muted-foreground">{schedule.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}