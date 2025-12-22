import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image?: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-start space-x-3">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-primary">{item.price} FCFA</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 hover:bg-destructive/10 text-destructive rounded-full transition-colors ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}