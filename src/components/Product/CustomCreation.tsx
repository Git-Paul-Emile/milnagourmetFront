import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomCreation } from './hooks/useCustomCreation';
import { addCustomCreationToCart } from './utils/addToCart';
import { Button } from '@/components/ui/button';
import {
  SizeSelector,
  FruitSelector,
  SauceSelector,
  CerealeSelector,
  QuantitySelector,
  LoadingState
} from './components';

interface CustomCreationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomCreation({ isOpen, onClose }: CustomCreationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const {
    creation,
    creationSizes,
    creationOptions,
    loading,
    config,
    toggleFruit,
    toggleSauce,
    toggleCereale,
    updateQuantity,
    setSize,
    resetCreation,
    isValid,
    dispatch
  } = useCustomCreation(isOpen);

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
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden border border-border flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold">Créer mon Gourmet</h2>
              <p className="text-muted-foreground">Composez votre yaourt selon vos envies</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

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

            <CerealeSelector
              cereales={creationOptions.cereales}
              selectedCereales={creation.cereales}
              onToggleCereale={toggleCereale}
            />

            {/* Quantité et ajout au panier - Amélioré pour mobile */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 sm:p-6 space-y-4 shadow-lg">
              <QuantitySelector
                quantity={creation.quantity}
                onUpdateQuantity={updateQuantity}
              />

              {/* Total et bouton - Layout amélioré pour mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="text-center sm:text-right bg-primary/5 rounded-lg p-4 sm:p-3 w-full sm:w-auto">
                  <p className="text-sm text-muted-foreground font-medium">Total à payer</p>
                  <p className="text-3xl sm:text-2xl font-bold text-primary">
                    {config.price * creation.quantity} FCFA
                  </p>
                </div>
                <Button
                  onClick={handleAddToCart}
                  loading={isAdding}
                  disabled={!isValid}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all transform-gpu bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-xl hover:shadow-primary/25 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-lg sm:text-base">Ajouter au panier</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


