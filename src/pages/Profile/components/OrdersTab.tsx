import React from 'react';
import { ShoppingBag, Search, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types';
import { formatDate, getStatusColor, getStatusIcon } from '@/pages/Profile/utils';
import { OrdersFilters } from '@/pages/Profile/types';
import { getFullImageUrl } from '@/utils/imageUtils';

interface OrdersTabProps {
  orders: Order[];
  loading: boolean;
  filteredOrders: Order[];
  filters: OrdersFilters;
  onFiltersChange: React.Dispatch<React.SetStateAction<OrdersFilters>>;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  loading,
  filteredOrders,
  filters,
  onFiltersChange
}) => {
  const navigate = useNavigate();

  const handleResetFilters = () => {
    onFiltersChange({
      searchTerm: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5" />
          <span>Historique des commandes</span>
        </CardTitle>
        <CardDescription>
          Toutes vos commandes passées chez Milna Gourmet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OrdersFiltersComponent
          filters={filters}
          onFiltersChange={onFiltersChange}
          onReset={handleResetFilters}
          ordersCount={filteredOrders.length}
        />

        {filteredOrders.length > 0 ? (
          <OrdersList orders={filteredOrders} />
        ) : (
          <EmptyOrdersState onNavigateToProducts={() => navigate('/')} />
        )}
      </CardContent>
    </Card>
  );
};

interface OrdersFiltersComponentProps {
  filters: OrdersFilters;
  onFiltersChange: React.Dispatch<React.SetStateAction<OrdersFilters>>;
  onReset: () => void;
  ordersCount: number;
}

const OrdersFiltersComponent: React.FC<OrdersFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onReset,
  ordersCount
}) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium mb-1 flex items-center">
            <Search className="h-4 w-4 mr-1" />
            Rechercher
          </Label>
          <Input
            placeholder="Nom du produit..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="h-9"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Trier par</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange(prev => ({ ...prev, sortBy: value as 'date' | 'total' }))}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="total">Montant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Ordre</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => onFiltersChange(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Récent d'abord</SelectItem>
              <SelectItem value="asc">Ancien d'abord</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Réinitialiser</span>
        </Button>
        <span className="text-sm text-muted-foreground">
          {ordersCount} commande{ordersCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

interface OrdersListProps {
  orders: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <Badge className={getStatusColor(order.status)}>
              <span className="mr-1">{getStatusIcon(order.status)}</span>
              <span className="capitalize">{order.status}</span>
            </Badge>
            <span className="text-sm text-muted-foreground">
              #{order.id.slice(-8)}
            </span>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{order.total} FCFA</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.date)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Articles commandés :</p>
          {order.items.filter(Boolean).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded">
              <div className="flex items-center space-x-2">
                {item?.image && (
                  <img
                    src={getFullImageUrl(item.image)}
                    alt={item?.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>{item?.name || 'Article'}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </div>
              <span className="font-medium">{(item?.price || 0) * (item?.quantity || 0)} FCFA</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface EmptyOrdersStateProps {
  onNavigateToProducts: () => void;
}

const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({ onNavigateToProducts }) => {
  return (
    <div className="text-center py-8">
      <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
      <p className="text-muted-foreground mb-4">
        Vous n'avez pas encore passé de commande chez nous.
      </p>
      <Button onClick={onNavigateToProducts}>
        Découvrir nos produits
      </Button>
    </div>
  );
};