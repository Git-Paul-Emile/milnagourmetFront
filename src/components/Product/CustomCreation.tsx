import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Info, Check } from 'lucide-react';
import { useCustomCreation } from './hooks/useCustomCreation';
import { addCustomCreationToCart } from './utils/addToCart';
import { Button } from '@/components/ui/button';
import {
  SizeSelector,
  FruitSelector,
  SauceSelector,
  QuantitySelector,
  LoadingState
} from './components';

interface CustomCreationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomCreation({ isOpen, onClose }: CustomCreationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const {
    creation,
    creationSizes,
    creationOptions,
    loading,
    config,
    toggleFruit,
    toggleSauce,
    updateQuantity,
    setSize,
    resetCreation,
    isValid,
    dispatch
  } = useCustomCreation(isOpen);

  // Accessibilité : fermeture au clavier (Échap) + verrou du défilement de
  // l'arrière-plan tant que la fenêtre est ouverte (évite le double scroll).
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Place le focus sur la fenêtre pour la navigation clavier.
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const handleAddToCart = async () => {
    if (!config) return;
    setIsAdding(true);
    try {
      const success = await addCustomCreationToCart(creation, config, creationSizes, dispatch);
      if (success) {
        resetCreation();
        onClose();
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  if (loading || !config || !creationOptions) {
    return <LoadingState />;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Fenêtre modale */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="creation-title"
          aria-describedby="creation-subtitle"
          tabIndex={-1}
          className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border flex flex-col focus:outline-none shadow-strong"
        >
          {/* En-tête (fixe) */}
          <div className="flex items-center justify-between gap-4 p-6 border-b border-border">
            <div>
              <h2 id="creation-title" className="text-2xl font-bold">Créer mon Gourmet</h2>
              <p id="creation-subtitle" className="text-muted-foreground">
                Composez votre yaourt selon vos envies
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="p-2 rounded-full text-muted-foreground transition-colors duration-200 cursor-pointer hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Corps défilant (étapes) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <SizeSelector
              creationSizes={creationSizes}
              selectedSize={creation.size}
              onSizeChange={setSize}
            />

            <FruitSelector
              fruits={creationOptions.fruits}
              selectedFruits={creation.fruits}
              maxFruits={config.maxFruits}
              onToggleFruit={toggleFruit}
            />

            <SauceSelector
              sauces={creationOptions.sauces}
              selectedSauces={creation.sauces}
              maxSauces={config.maxSauces}
              onToggleSauce={toggleSauce}
            />
          </div>

          {/* Pied épinglé (toujours visible) : quantité, total, action */}
          <div className="border-t border-border bg-background p-4 sm:p-6 space-y-4">
            <QuantitySelector
              quantity={creation.quantity}
              onUpdateQuantity={updateQuantity}
            />

            {/* Compteur d'extras (façon barre OKANA) + indice de validation :
                on dit ce qui est choisi, et ce qui manque le cas échéant. */}
            {isValid ? (
              <p role="status" className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-[#212121]">
                <Check className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {creation.fruits.length + creation.sauces.length} extra(s) sélectionné(s)
              </p>
            ) : (
              <p role="status" className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Sélectionnez au moins un fruit ou une sauce pour continuer.
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Total au format des cartes produits : montant en primary,
                  unité FCFA séparée en muted. */}
              <div className="text-center sm:text-left bg-muted/60 rounded-xl px-4 py-3 w-full sm:w-auto">
                <p className="text-sm text-muted-foreground font-medium">Total à payer</p>
                <p className="flex items-baseline justify-center sm:justify-start space-x-1.5">
                  <span className="text-3xl sm:text-2xl font-bold text-primary">
                    {config.price * creation.quantity}
                  </span>
                  <span className="text-sm text-muted-foreground">FCFA</span>
                </p>
              </div>
              {/* Bouton identique à celui des cartes produits (ProductActions) :
                  blanc au repos, bleu #43A2F2 au survol, reflet balayé, icône
                  panier qui pivote. */}
              <Button
                onClick={handleAddToCart}
                loading={isAdding}
                disabled={!isValid}
                aria-label="Ajouter la création au panier"
                className={
                  'group relative flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-300 transform-gpu overflow-hidden cursor-pointer ' +
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
                  (isValid
                    ? 'bg-white border border-border text-foreground hover:bg-[#43A2F2] hover:text-white hover:border-[#43A2F2] hover:scale-105 hover:-translate-y-0.5 active:scale-95 ' +
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
                    : 'bg-muted text-muted-foreground cursor-not-allowed border border-border')
                }
              >
                <ShoppingCart
                  className={
                    'h-5 w-5 transition-transform duration-300 ' +
                    (isValid ? 'group-hover:scale-110 group-hover:rotate-12' : '')
                  }
                  aria-hidden="true"
                />
                <span className="relative z-10 text-lg sm:text-base">Ajouter au panier</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
