import React from 'react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/useApp';
import { CustomerInfoModal } from './CustomerInfoModal';
import { CartHeader, CartItem, CartFooter, EmptyCart, PointsSelector } from './components';
import { useDeliveryZone, useCartOperations } from './hooks';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { state, dispatch } = useApp();
  const deliveryZone = useDeliveryZone();
  const {
    isOrdering,
    isCustomerInfoModalOpen,
    setIsCustomerInfoModalOpen,
    updateQuantity,
    removeItem,
    clearCart,
    handleOrder
  } = useCartOperations(deliveryZone, onClose);

  const handlePointsChange = (pointsUsed: number) => {
    dispatch({ type: 'SET_POINTS_USED', payload: pointsUsed });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className={cn(
        'fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50',
        'flex flex-col overflow-hidden',
        'transform-gpu transition-all duration-500 ease-out',
        'shadow-2xl shadow-black/20',
        isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95',
        'backdrop-blur-sm bg-background/95'
      )}>
        <CartHeader onClose={onClose} />

        {/* Content — min-h-0 is required so flex-1 can shrink below its content size */}
        <div className="flex flex-col flex-1 min-h-0">
          {state.cart.items.length === 0 ? (
            <EmptyCart onClose={onClose} />
          ) : (
            <>
              {/* Cart Items — scrollable zone */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}

                {/* Points Selector - only show for logged-in users */}
                {state.user && (
                  <PointsSelector
                    availablePoints={state.user.pointsFidelite || 0}
                    currentTotal={state.cart.totalWithDelivery}
                    onPointsChange={handlePointsChange}
                    conversionRate={15} // 1 point = 15 CFA
                  />
                )}
              </div>

              <CartFooter
                deliveryZone={deliveryZone}
                isOrdering={isOrdering}
                onOrder={handleOrder}
                onClearCart={clearCart}
              />
            </>
          )}
        </div>
      </div>


      {/* Customer Info Modal */}
      <CustomerInfoModal
        isOpen={isCustomerInfoModalOpen}
        onClose={() => setIsCustomerInfoModalOpen(false)}
        onOrderSuccess={onClose}
      />
    </>
  );
}

