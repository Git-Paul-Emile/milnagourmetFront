import { ShoppingBag } from 'lucide-react';
import { useStoreHours } from '@/hooks/useStoreHours';
import { CLOSED_ORDERS_NOTICE } from '@/constants/contact';
import { cn } from '@/lib/utils';

/**
 * Bandeau en haut de page : état de la boutique, fixe quand elle est
 * ouverte. Fermée, il défile pour rappeler que les commandes restent
 * possibles et seront traitées à l'ouverture.
 */
export function StoreStatusBar() {
  const { isOpen, message, nextChange } = useStoreHours();

  const etat = [...message.split(' - '), nextChange].filter(Boolean).join(', ');

  const segments = [
    { key: 'etat', icon: null, text: etat },
    ...(isOpen ? [] : [{ key: 'commande', icon: ShoppingBag, text: CLOSED_ORDERS_NOTICE }]),
  ];

  const contenu = (copie: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copie > 0 || undefined}>
      {segments.map(({ key, icon: Icon, text }) => (
        <span key={key} className="flex items-center gap-2 whitespace-nowrap px-6">
          {Icon && <Icon className="h-4 w-4" />}
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
      {isOpen ? (
        <div className="flex justify-center">{contenu(0)}</div>
      ) : (
        <div className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
          {contenu(0)}
          {contenu(1)}
        </div>
      )}
    </div>
  );
}
