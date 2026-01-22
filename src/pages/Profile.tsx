import React, { useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Edit, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/pages/Profile/hooks/useProfile';
import { useOrders } from '@/pages/Profile/hooks/useOrders';
import { ProfileTab, OrdersTab, SettingsTab } from '@/pages/Profile/components';
import { LoyaltyTab } from '@/components/User/components/LoyaltyTab';

const Profile = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const { state: profileState, actions: profileActions } = useProfile();
  const { orders, loading: ordersLoading, filteredOrders, filters, setFilters } = useOrders();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations et consultez votre historique</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Fidélité</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Paramètres</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileTab
                isEditing={profileState.isEditing}
                editForm={profileState.editForm}
                deliveryZones={profileState.deliveryZones}
                onEdit={profileActions.handleEdit}
                onSave={profileActions.handleSave}
                onCancel={profileActions.handleCancel}
                onEditFormChange={profileActions.setEditForm}
              />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersTab
                orders={orders}
                loading={ordersLoading}
                filteredOrders={filteredOrders}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </TabsContent>

            <TabsContent value="loyalty" className="space-y-6">
              <LoyaltyTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab onDeleteAccount={profileActions.handleDeleteAccount} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Profile;