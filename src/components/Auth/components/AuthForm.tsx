import React from 'react';
import { User as UserIcon, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthMode, FormData, FieldErrors } from '../types/authTypes';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { SelectField } from './SelectField';
import { DeliveryZone } from '@/types';

interface AuthFormProps {
  mode: AuthMode;
  formData: FormData;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  deliveryZones: DeliveryZone[];
  fieldErrors: FieldErrors;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: () => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  formData,
  showPassword,
  showConfirmPassword,
  isLoading,
  deliveryZones,
  fieldErrors,
  onInputChange,
  onSubmit,
  onSwitchMode,
  setShowPassword,
  setShowConfirmPassword
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {mode === 'register' && (
        <InputField
          label="Nom complet"
          icon={UserIcon}
          value={formData.nomComplet}
          onChange={(value) => onInputChange('nomComplet', value)}
          placeholder="Votre nom complet"
          error={fieldErrors.nomComplet}
        />
      )}

      <InputField
        label="Téléphone"
        icon={Phone}
        value={formData.telephone}
        onChange={(value) => onInputChange('telephone', value)}
        placeholder="+221 XX XXX XX XX"
        type="tel"
        error={fieldErrors.telephone}
      />

      {mode === 'register' && (
        <SelectField
          label="Zone de livraison"
          value={formData.zoneLivraison}
          onChange={(value) => onInputChange('zoneLivraison', value)}
          options={deliveryZones}
          error={fieldErrors.zoneLivraison}
        />
      )}

      <PasswordField
        label="Mot de passe"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        placeholder="••••••••"
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        error={fieldErrors.password}
      />

      {mode === 'register' && (
        <PasswordField
          label="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={(value) => onInputChange('confirmPassword', value)}
          placeholder="••••••••"
          showPassword={showConfirmPassword}
          onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          error={fieldErrors.confirmPassword}
        />
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'group relative w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform-gpu overflow-hidden',
          'bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100',
          'text-primary-foreground hover:shadow-xl hover:shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 active:scale-95',
          isLoading && 'opacity-50 cursor-not-allowed',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
        )}
      >
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          )}
          <span>{isLoading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer mon compte')}</span>
        </span>
        {!isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      <div className="text-center pt-4">
        <p className="text-muted-foreground">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          <button
            type="button"
            onClick={onSwitchMode}
            className="ml-2 text-primary font-semibold hover:underline"
          >
            {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
    </form>
  );
};