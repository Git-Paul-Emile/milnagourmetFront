import { ShoppingBag, Store } from 'lucide-react';
import { useStoreHours } from '@/hooks/useStoreHours';
import { CLOSED_ORDERS_NOTICE } from '@/constants/contact';
import { cn } from '@/lib/utils';

/**
 * Bandeau défilant en haut de page : état de la boutique et, si elle est
 * fermée, rappel que les commandes restent possibles.
 */
export function StoreStatusBar() {
  const { isOpen, message, nextChange } = useStoreHours();

  const etat = [...message.split(' - '), nextChange].filter(Boolean).join(', ');

  const segments = [
    { key: 'etat', icon: Store, text: etat },
    ...(isOpen ? [] : [{ key: 'commande', icon: ShoppingBag, text: CLOSED_ORDERS_NOTICE }]),
  ];

  const contenu = (copie: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copie > 0 || undefined}>
      {segments.map(({ key, icon: Icon, text }) => (
        <span key={key} className="flex items-center gap-2 whitespace-nowrap px-6">
          <Icon className={cn('h-4 w-4', key === 'etat' && (isOpen ? 'text-green-300' : 'text-red-500'))} />
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div
      role="status"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 overflow-hidden py-2 text-sm font-medium transition-colors',
        isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
        {contenu(0)}
        {contenu(1)}
      </div>
    </div>
  );
}
