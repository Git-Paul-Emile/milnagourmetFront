import React from 'react';
import { Clock } from 'lucide-react';

export function OrderEmptyState() {
  return (
    <div className="text-center py-12">
      <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
      <p className="text-muted-foreground">Les nouvelles commandes apparaîtront ici.</p>
    </div>
  );
}