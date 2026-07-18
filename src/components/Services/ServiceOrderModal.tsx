import React, { useMemo, useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/useApp';
import { SpecialService, Product } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceOrderModalProps {
  service: SpecialService | null;
  onClose: () => void;
}

const DEFAULT_CUSTOM_FIELDS = 3;

/**
 * Composition d'une commande de service spécial (Panier gourmand / Boîte pancake).
 * Prix sur devis : l'article est ajouté au panier à 0 FCFA et le vendeur
 * communique le prix après réception de la commande.
 */
export function ServiceOrderModal({ service, onClose }: ServiceOrderModalProps) {
  const { dispatch } = useApp();
  const [formule, setFormule] = useState<'basique' | 'personnalise'>('basique');
  const [customFields, setCustomFields] = useState<string[]>(
    Array(DEFAULT_CUSTOM_FIELDS).fill('')
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});
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
    setCustomFields(Array(DEFAULT_CUSTOM_FIELDS).fill(''));
    setQuantities({});
    setNote('');
  }, [service]);

  if (!service) return null;

  const updateCustomField = (index: number, value: string) => {
    setCustomFields((prev) => prev.map((f, i) => (i === index ? value : f)));
  };

  const addCustomField = () => setCustomFields((prev) => [...prev, '']);

  const updateQuantity = (name: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] ?? 0) + delta) }));
  };

  const filledCustomFields = customFields.map((f) => f.trim()).filter(Boolean);
  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const isValid = isPanier
    ? formule === 'basique' || filledCustomFields.length >= minElements
    : totalQuantity >= minElements;

  const buildDescription = (): string => {
    const parts: string[] = [];
    if (isPanier) {
      if (formule === 'basique') {
        parts.push(`Formule basique : ${availableComponents.map((c) => c.name).join(', ')}`);
      } else {
        parts.push(`Formule personnalisée : ${filledCustomFields.join(', ')}`);
      }
    } else {
      const composition = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => `${name} x${qty}`)
        .join(', ');
      parts.push(`Composition : ${composition} (${totalQuantity} pièces)`);
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
                    ? 'border-button-border bg-button hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground '
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
                    ? 'border-button-border bg-button hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground '
                    : 'border-border hover:bg-muted'
                )}
              >
                Personnalisé
              </button>
            </div>

            {formule === 'basique' ? (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Composition standard :</p>
                <ul className="space-y-1.5">
                  {availableComponents.map((c) => (
                    <li key={c.id} className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <span className="text-sm text-muted-foreground">{c.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium mb-2">
                  Composez votre panier vous-même (minimum {minElements}) :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customFields.map((value, index) => (
                    <Input
                      key={index}
                      value={value}
                      onChange={(e) => updateCustomField(index, e.target.value)}
                      placeholder={`Composant ${index + 1}`}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addCustomField}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un champ
                </Button>
                {filledCustomFields.length < minElements && (
                  <p className="text-xs text-destructive mt-2" role="alert">
                    Remplissez au moins {minElements} champs ({filledCustomFields.length}/{minElements})
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Boîte pancake : quantité par type (pancake, crêpes, madeleine…) */
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Choisissez vos quantités (minimum {minElements} pièces au total) :
            </p>
            <div className="space-y-2">
              {availableComponents.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border"
                >
                  <span className="text-sm">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Diminuer la quantité de ${c.name}`}
                      onClick={() => updateQuantity(c.name, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium" aria-live="polite">
                      {quantities[c.name] ?? 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Augmenter la quantité de ${c.name}`}
                      onClick={() => updateQuantity(c.name, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p
              className={cn(
                'text-xs mt-2',
                totalQuantity < minElements ? 'text-destructive' : 'text-muted-foreground'
              )}
              role={totalQuantity < minElements ? 'alert' : undefined}
            >
              Total : {totalQuantity}/{minElements} pièces
            </p>
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
