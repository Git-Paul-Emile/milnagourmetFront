import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/useApp';
import { SpecialService, Product } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceOrderModalProps {
  service: SpecialService | null;
  onClose: () => void;
}

/** Vignette d'un élément : image détourée (object-contain) ou initiale en repli. */
function ComponentThumb({
  image,
  name,
  className,
}: {
  image?: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'shrink-0 overflow-hidden rounded-md bg-white flex items-center justify-center',
        className ?? 'h-9 w-9'
      )}
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="h-full w-full object-contain p-0.5"
        />
      ) : (
        <span className="text-xs font-bold opacity-40">{name.charAt(0)}</span>
      )}
    </span>
  );
}

/**
 * Composition d'une commande de service spécial. Le comportement dépend du
 * type du service :
 *  - PANIER_FIXE  : éléments par défaut affichés, non modifiables.
 *  - PANIER_PERSO : défauts désélectionnables + champs libres pour ajouter.
 *  - MONO_SAVEUR  : un seul élément au choix, quantité min (ex. 10).
 *  - ASSORTIMENT  : quantité par élément, jamais sous la quantité par défaut.
 *
 * Le prix est "à partir de basePrice" pour les paniers (ajusté par le vendeur),
 * sur devis pour les boîtes.
 */
export function ServiceOrderModal({ service, onClose }: ServiceOrderModalProps) {
  const { dispatch } = useApp();

  const type = service?.serviceType ?? 'PANIER_FIXE';
  const minElements = service?.minElements ?? 1;
  const basePrice = service?.basePrice ?? 0;

  const availableComponents = useMemo(
    () => (service?.components ?? []).filter((c) => c.available),
    [service]
  );

  // États couvrant les différents types
  const [deselected, setDeselected] = useState<Set<number>>(new Set()); // PANIER_PERSO : défauts retirés
  const [customFields, setCustomFields] = useState<string[]>(['', '', '']); // PANIER_PERSO : ajouts libres
  const [monoChoice, setMonoChoice] = useState<number | null>(null); // MONO_SAVEUR : id élément
  const [monoQty, setMonoQty] = useState<number>(minElements); // MONO_SAVEUR : quantité
  const [quantities, setQuantities] = useState<Record<number, number>>({}); // ASSORTIMENT : id -> qté

  // Réinitialisation à chaque ouverture d'un service
  useEffect(() => {
    setDeselected(new Set());
    setCustomFields(['', '', '']);
    setMonoChoice(null);
    setMonoQty(service?.minElements ?? 1);
    // ASSORTIMENT : partir des quantités par défaut (planchers)
    const initial: Record<number, number> = {};
    (service?.components ?? [])
      .filter((c) => c.available)
      .forEach((c) => {
        initial[c.id] = c.defaultQuantity ?? 0;
      });
    setQuantities(initial);
  }, [service]);

  if (!service) return null;

  const defaultComponents = availableComponents.filter((c) => c.isDefault);
  const filledCustomFields = customFields.map((f) => f.trim()).filter(Boolean);

  // --- Validité par type ---
  const keptDefaults = defaultComponents.filter((c) => !deselected.has(c.id));
  const isValid = (() => {
    switch (type) {
      case 'PANIER_FIXE':
        return keptDefaults.length > 0;
      case 'PANIER_PERSO':
        return keptDefaults.length + filledCustomFields.length >= 1;
      case 'MONO_SAVEUR':
        return monoChoice !== null && monoQty >= minElements;
      case 'ASSORTIMENT':
        return availableComponents.some((c) => (quantities[c.id] ?? 0) > 0);
      default:
        return true;
    }
  })();

  // --- Description envoyée au vendeur ---
  const buildDescription = (): string => {
    const parts: string[] = [];
    if (type === 'PANIER_FIXE') {
      parts.push(`Panier : ${keptDefaults.map((c) => c.name).join(', ')}`);
    } else if (type === 'PANIER_PERSO') {
      const items = [...keptDefaults.map((c) => c.name), ...filledCustomFields];
      parts.push(`Panier personnalisé : ${items.join(', ')}`);
    } else if (type === 'MONO_SAVEUR') {
      const chosen = availableComponents.find((c) => c.id === monoChoice);
      parts.push(`${chosen?.name ?? 'Gourmandise'} x${monoQty}`);
    } else if (type === 'ASSORTIMENT') {
      const composition = availableComponents
        .filter((c) => (quantities[c.id] ?? 0) > 0)
        .map((c) => `${c.name} x${quantities[c.id]}`)
        .join(', ');
      const total = availableComponents.reduce((s, c) => s + (quantities[c.id] ?? 0), 0);
      parts.push(`Assortiment : ${composition} (${total} pièces)`);
    }
    parts.push(basePrice > 0 ? `À partir de ${basePrice.toLocaleString('fr-FR')} FCFA` : 'Prix sur commande');
    return parts.join(' — ');
  };

  const handleAddToCart = () => {
    if (!isValid || !service.linkedProduct) return;

    const product: Product = {
      id: String(service.linkedProduct.id),
      name: service.name,
      category: service.linkedProduct.category,
      price: basePrice,
      description: service.description ?? '',
      image: service.image ?? '',
      available: true,
    };

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        // L'id DOIT commencer par l'id numérique du produit lié :
        // le backend résout la ligne de commande via parseInt(item.id)
        id: `${service.linkedProduct.id}-${Date.now()}`,
        product,
        quantity: 1,
        price: basePrice,
        name: service.name,
        description: buildDescription(),
        image: service.image ?? undefined,
        isServiceQuote: true,
      },
    });

    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        message:
          basePrice > 0
            ? `${service.name} ajouté au panier — prix ajusté par le vendeur`
            : `${service.name} ajouté au panier — le vendeur vous communiquera le prix`,
      },
    });

    onClose();
  };

  const toggleDefault = (id: number) => {
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateCustomField = (index: number, value: string) =>
    setCustomFields((prev) => prev.map((f, i) => (i === index ? value : f)));
  const addCustomField = () => setCustomFields((prev) => [...prev, '']);

  const updateAssortiment = (component: { id: number; defaultQuantity: number }, delta: number) =>
    setQuantities((prev) => ({
      ...prev,
      // Plancher = quantité par défaut : on ne descend jamais en dessous
      [component.id]: Math.max(component.defaultQuantity ?? 0, (prev[component.id] ?? 0) + delta),
    }));

  const priceLabel =
    basePrice > 0 ? `À partir de ${basePrice.toLocaleString('fr-FR')} FCFA` : 'Prix sur commande';

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>
            {basePrice > 0
              ? 'Prix de départ indicatif ; le vendeur confirme le montant selon votre composition.'
              : 'Le prix vous sera communiqué par le vendeur après réception de votre commande.'}
          </DialogDescription>
        </DialogHeader>

        {/* PANIER_FIXE : composition figée */}
        {type === 'PANIER_FIXE' && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Ce panier contient :</p>
            <ul className="space-y-2">
              {defaultComponents.map((c) => (
                <li key={c.id} className="flex items-center gap-2.5 text-sm">
                  <ComponentThumb image={c.image} name={c.name} />
                  <span className="flex-1">{c.name}</span>
                  <Check className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PANIER_PERSO : défauts désélectionnables + ajouts libres */}
        {type === 'PANIER_PERSO' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Éléments inclus (décochez pour retirer) :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {defaultComponents.map((c) => {
                  const kept = !deselected.has(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={kept}
                      onClick={() => toggleDefault(c.id)}
                      className={cn(
                        'flex items-center gap-2 p-2.5 rounded-lg border text-sm text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        kept ? 'border-button-border bg-button/5' : 'border-border opacity-60 line-through'
                      )}
                    >
                      <ComponentThumb image={c.image} name={c.name} className="h-8 w-8" />
                      <span className="flex-1">{c.name}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full shrink-0',
                          kept ? 'bg-secondary-light text-white' : 'bg-muted text-transparent'
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Ajoutez vos éléments :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {customFields.map((value, index) => (
                  <Input
                    key={index}
                    value={value}
                    onChange={(e) => updateCustomField(index, e.target.value)}
                    placeholder={`Élément ${index + 1}`}
                  />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2 bg-white hover:bg-white hover:text-foreground hover:border-input" onClick={addCustomField}>
                <Plus className="h-4 w-4" />
                Ajouter un champ
              </Button>
            </div>
          </div>
        )}

        {/* MONO_SAVEUR : une gourmandise, quantité min */}
        {type === 'MONO_SAVEUR' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Cette boîte contient une seule gourmandise, à choisir :</p>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Gourmandise">
                {availableComponents.map((c) => {
                  const active = monoChoice === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setMonoChoice(c.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active ? 'border-button-border bg-button/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <ComponentThumb image={c.image} name={c.name} className="h-14 w-14" />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
              <span className="text-sm font-medium">Quantité (min. {minElements})</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon" className="bg-white hover:bg-white hover:text-foreground hover:border-input"
                  aria-label="Diminuer la quantité"
                  disabled={monoQty <= minElements}
                  onClick={() => setMonoQty((q) => Math.max(minElements, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium" aria-live="polite">{monoQty}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon" className="bg-white hover:bg-white hover:text-foreground hover:border-input"
                  aria-label="Augmenter la quantité"
                  onClick={() => setMonoQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ASSORTIMENT : quantité par élément, plancher = défaut */}
        {type === 'ASSORTIMENT' && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Cette boîte contient :</p>
            <p className="text-xs text-muted-foreground -mt-1">
              Les quantités de départ ne sont pas réductibles, seulement augmentables.
            </p>
            <div className="space-y-2">
              {availableComponents.map((c) => {
                const qty = quantities[c.id] ?? 0;
                const atFloor = qty <= (c.defaultQuantity ?? 0);
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border"
                  >
                    <span className="flex items-center gap-2.5 text-sm">
                      <ComponentThumb image={c.image} name={c.name} />
                      <span>
                        {c.name}
                        {c.defaultQuantity > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">(min. {c.defaultQuantity})</span>
                        )}
                      </span>
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon" className="bg-white hover:bg-white hover:text-foreground hover:border-input"
                        aria-label={`Diminuer la quantité de ${c.name}`}
                        disabled={atFloor}
                        onClick={() => updateAssortiment(c, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon" className="bg-white hover:bg-white hover:text-foreground hover:border-input"
                        aria-label={`Augmenter la quantité de ${c.name}`}
                        onClick={() => updateAssortiment(c, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <span className="text-sm font-semibold text-primary">{priceLabel}</span>
          {/* Bouton identique à celui des cartes produits (ProductActions) :
              blanc au repos, bleu #43A2F2 au survol, reflet balayé, icône
              panier qui pivote. */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isValid}
            className={cn(
              'group relative flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform-gpu overflow-hidden',
              isValid
                ? 'bg-white border border-border text-foreground hover:bg-[#43A2F2] hover:text-white hover:border-[#43A2F2] hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border',
              'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
            )}
          >
            <ShoppingCart
              className={cn('h-4 w-4 transition-transform duration-300', isValid && 'group-hover:scale-110 group-hover:rotate-12')}
            />
            <span className="relative z-10">Ajouter au panier</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
