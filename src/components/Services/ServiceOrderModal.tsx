import React, { useMemo, useState } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/useApp';
import { SpecialService, Product } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceOrderModalProps {
  service: SpecialService | null;
  onClose: () => void;
}

/**
 * Composition d'une commande de service spécial (Panier gourmand / Boîte pancake).
 * Prix sur devis : l'article est ajouté au panier à 0 FCFA et le vendeur
 * communique le prix après réception de la commande.
 */
export function ServiceOrderModal({ service, onClose }: ServiceOrderModalProps) {
  const { dispatch } = useApp();
  const [formule, setFormule] = useState<'basique' | 'personnalise'>('basique');
  const [selected, setSelected] = useState<string[]>([]);
  const [pieces, setPieces] = useState<number>(service?.minElements ?? 10);
  const [note, setNote] = useState('');

  const isPanier = service?.code === 'panier';
  const minElements = service?.minElements ?? 1;

  const availableComponents = useMemo(
    () => (service?.components ?? []).filter((c) => c.available),
    [service]
  );

  // Réinitialisation à l'ouverture d'un nouveau service
  React.useEffect(() => {
    setFormule('basique');
    setSelected([]);
    setPieces(service?.minElements ?? 10);
    setNote('');
  }, [service]);

  if (!service) return null;

  const toggleComponent = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isValid = isPanier
    ? formule === 'basique' || selected.length >= minElements
    : pieces >= minElements;

  const buildDescription = (): string => {
    const parts: string[] = [];
    if (isPanier) {
      if (formule === 'basique') {
        parts.push(`Formule basique : ${availableComponents.map((c) => c.name).join(', ')}`);
      } else {
        parts.push(`Formule personnalisée : ${selected.join(', ')}`);
      }
    } else {
      parts.push(`${pieces} pièces`);
    }
    if (note.trim()) parts.push(`Note : ${note.trim()}`);
    parts.push('Prix sur devis');
    return parts.join(' — ');
  };

  const handleAddToCart = () => {
    if (!isValid || !service.linkedProduct) return;

    const product: Product = {
      id: String(service.linkedProduct.id),
      name: service.name,
      category: service.linkedProduct.category,
      price: 0,
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
        price: 0,
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
        message: `${service.name} ajouté au panier — le vendeur vous communiquera le prix`,
      },
    });

    onClose();
  };

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>
            Le prix vous sera communiqué par le vendeur après réception de votre commande.
          </DialogDescription>
        </DialogHeader>

        {isPanier ? (
          <div className="space-y-4">
            {/* Choix de la formule */}
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Formule du panier">
              <button
                type="button"
                role="radio"
                aria-checked={formule === 'basique'}
                onClick={() => setFormule('basique')}
                className={cn(
                  'p-3 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  formule === 'basique'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted'
                )}
              >
                Panier basique
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={formule === 'personnalise'}
                onClick={() => setFormule('personnalise')}
                className={cn(
                  'p-3 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  formule === 'personnalise'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted'
                )}
              >
                Personnalisé
              </button>
            </div>

            {formule === 'basique' ? (
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="font-medium mb-2">Composition standard :</p>
                <p className="text-muted-foreground">
                  {availableComponents.map((c) => c.name).join(', ')}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium mb-2">
                  Choisissez vos composants (minimum {minElements}) :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableComponents.map((c) => (
                    <Label
                      key={c.id}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                        selected.includes(c.name)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted'
                      )}
                    >
                      <Checkbox
                        checked={selected.includes(c.name)}
                        onCheckedChange={() => toggleComponent(c.name)}
                      />
                      <span className="text-sm">{c.name}</span>
                    </Label>
                  ))}
                </div>
                {selected.length < minElements && (
                  <p className="text-xs text-destructive mt-2" role="alert">
                    Sélectionnez au moins {minElements} composants ({selected.length}/{minElements})
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Boîte pancake : nombre de pièces */
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Nombre de pancakes (minimum {minElements}) :
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Diminuer le nombre de pancakes"
                onClick={() => setPieces((p) => Math.max(minElements, p - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-xl font-bold" aria-live="polite">
                {pieces}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Augmenter le nombre de pancakes"
                onClick={() => setPieces((p) => p + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Note libre */}
        <div className="space-y-1">
          <Label htmlFor="service-note" className="text-sm">
            Précisions pour le vendeur (optionnel)
          </Label>
          <Textarea
            id="service-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Allergies, préférences, occasion…"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-primary">Prix sur devis</span>
          <Button onClick={handleAddToCart} disabled={!isValid}>
            <ShoppingCart className="h-4 w-4" />
            Ajouter au panier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
