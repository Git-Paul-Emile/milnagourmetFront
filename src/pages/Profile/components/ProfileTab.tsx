import React from 'react';
import { User, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/useApp';
import { DeliveryZone, AuthUser } from '@/types';
import { formatMemberSince } from '@/pages/Profile/utils';
import { ProfileEditForm } from '@/pages/Profile/types';

interface ProfileTabProps {
  isEditing: boolean;
  editForm: ProfileEditForm;
  deliveryZones: DeliveryZone[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditFormChange: React.Dispatch<React.SetStateAction<ProfileEditForm>>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  isEditing,
  editForm,
  deliveryZones,
  onEdit,
  onSave,
  onCancel,
  onEditFormChange
}) => {
  const { state } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Informations personnelles</span>
        </CardTitle>
        <CardDescription>
          Vos informations de compte et coordonnées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEditing ? (
          <ProfileDisplay user={state.user} onEdit={onEdit} />
        ) : (
          <ProfileEdit
            editForm={editForm}
            deliveryZones={deliveryZones}
            onSave={onSave}
            onCancel={onCancel}
            onEditFormChange={onEditFormChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface ProfileDisplayProps {
  user: AuthUser | null;
  onEdit: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user, onEdit }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Nom complet</p>
            <p className="font-medium">{user?.nomComplet || ''}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Téléphone</p>
            <p className="font-medium">{user?.telephone || ''}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Zone de livraison</p>
            <p className="font-medium">{user?.zoneLivraison || 'Non spécifiée'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
        <User className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Membre depuis</p>
          <p className="font-medium">
            {formatMemberSince(user?.createdAt ? new Date(user.createdAt) : new Date())}
          </p>
        </div>
      </div>

      <Button onClick={onEdit} className="w-full sm:w-auto">
        <Edit className="h-4 w-4 mr-2" />
        Modifier mes informations
      </Button>
    </div>
  );
};

interface ProfileEditProps {
  editForm: ProfileEditForm;
  deliveryZones: DeliveryZone[];
  onSave: () => void;
  onCancel: () => void;
  onEditFormChange: React.Dispatch<React.SetStateAction<ProfileEditForm>>;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  editForm,
  deliveryZones,
  onSave,
  onCancel,
  onEditFormChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={editForm.name}
            onChange={(e) => onEditFormChange(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Votre nom complet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={editForm.phone}
            onChange={(e) => onEditFormChange(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Votre numéro de téléphone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryZone">Zone de livraison</Label>
          <Select
            value={editForm.deliveryZoneId}
            onValueChange={(value) => onEditFormChange(prev => ({ ...prev, deliveryZoneId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une zone de livraison" />
            </SelectTrigger>
            <SelectContent>
              {deliveryZones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name} - {zone.deliveryFee} FCFA
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Ancien mot de passe</Label>
          <Input
            id="currentPassword"
            type="password"
            value={editForm.currentPassword || ''}
            onChange={(e) => onEditFormChange(prev => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Votre mot de passe actuel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={editForm.password}
            onChange={(e) => onEditFormChange(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Laissez vide pour ne pas changer"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={onSave} className="flex-1 sm:flex-none">
          <CheckCircle className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
          <XCircle className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  );
};