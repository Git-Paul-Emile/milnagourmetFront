import React, { useState } from 'react';
import { X, User as UserIcon, Package, Edit3, Star } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { cn } from '@/lib/utils';
import { useDeliveryZones } from './hooks/useDeliveryZones';
import { useProfileEditing } from './hooks/useProfileEditing';
import { ProfileTab } from './components/ProfileTab';
import { OrdersTab } from './components/OrdersTab';
import { SettingsTab } from './components/SettingsTab';
import { LoyaltyTab } from './components/LoyaltyTab';

interface UserProfileProps {
   isOpen: boolean;
   onClose: () => void;
}

type TabType = 'profile' | 'orders' | 'loyalty' | 'settings';

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
   const { state } = useApp();
   const { user } = state;
   const [activeTab, setActiveTab] = useState<TabType>('profile');

   const deliveryZones = useDeliveryZones();
   const {
      isEditing,
      setIsEditing,
      editData,
      setEditData,
      resetEditData,
      handleSaveProfile
   } = useProfileEditing(user);

   if (!isOpen || !user) return null;

   const tabs = [
      { id: 'profile' as TabType, label: 'Profil', icon: UserIcon },
      { id: 'orders' as TabType, label: 'Commandes', icon: Package },
      { id: 'loyalty' as TabType, label: 'Fidélité', icon: Star },
      { id: 'settings' as TabType, label: 'Paramètres', icon: Edit3 }
   ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Mon Profil</h2>
                <p className="text-muted-foreground">Gérez votre compte Milna Gourmet</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors',
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editData={editData}
                setEditData={setEditData}
                resetEditData={resetEditData}
                handleSaveProfile={handleSaveProfile}
                deliveryZones={deliveryZones}
              />
            )}

            {activeTab === 'orders' && (
               <OrdersTab orders={[]} />
             )}

             {activeTab === 'loyalty' && (
               <LoyaltyTab />
             )}

             {activeTab === 'settings' && (
               <SettingsTab user={user} onClose={onClose} />
             )}
          </div>
        </div>
      </div>
    </>
  );
}

