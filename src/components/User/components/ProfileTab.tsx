import React from 'react';
import { User as UserIcon, Phone, MapPin, Calendar, Edit3, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser, DeliveryZone } from '@/types';
import { formatDate } from '../utils';

interface ProfileTabProps {
  user: AuthUser;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editData: {
    name: string;
    phone: string;
    deliveryZoneId: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
  };
  setEditData: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    deliveryZoneId: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }>>;
  resetEditData: () => void;
  handleSaveProfile: () => void;
  deliveryZones: DeliveryZone[];
}

export function ProfileTab({
  user,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  resetEditData,
  handleSaveProfile,
  deliveryZones
}: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Modifier</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                resetEditData();
              }}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom complet</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{user.nomComplet}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Téléphone</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.telephone}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Zone de livraison</label>
          {isEditing ? (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={editData.deliveryZoneId}
                onChange={(e) => setEditData(prev => ({ ...prev, deliveryZoneId: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Sélectionnez une zone de livraison</option>
                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.deliveryFee} FCFA
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{deliveryZones.find(z => z.id === user.zoneLivraisonId)?.name || user.zoneLivraison || 'Non spécifiée'}</span>
            </div>
          )}
        </div>

        {isEditing && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ancien mot de passe</label>
              <input
                type="password"
                value={editData.currentPassword}
                onChange={(e) => setEditData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau mot de passe</label>
              <input
                type="password"
                value={editData.password}
                onChange={(e) => setEditData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                value={editData.confirmPassword}
                onChange={(e) => setEditData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Membre depuis</label>
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(user.createdAt as string)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}