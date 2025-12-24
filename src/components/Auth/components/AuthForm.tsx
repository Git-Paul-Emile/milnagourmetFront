import React from 'react';
import { User as UserIcon, Phone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthMode, FormData, FieldErrors } from '../types/authTypes';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { SelectField } from './SelectField';
import { useFloating, useInteractions, useHover, useFocus, useDismiss, useRole, FloatingPortal, arrow, shift, flip } from '@floating-ui/react';
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
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const arrowRef = React.useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isTooltipOpen,
    onOpenChange: setIsTooltipOpen,
    placement: 'top',
    middleware: [arrow({ element: arrowRef }), shift(), flip()],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
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

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Téléphone</label>
          <Info
            className="h-4 w-4 text-muted-foreground cursor-help"
            ref={refs.setReference}
            {...getReferenceProps()}
          />
        </div>
        {isTooltipOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50 px-4 py-2 text-sm text-popover-foreground bg-popover border border-border rounded-lg shadow-lg max-w-xs sm:max-w-sm transition-all duration-200 ease-in-out"
              {...getFloatingProps()}
            >
              Utilisez : 0XXXXXXXX (8-9 chiffres) ou +241XXXXXXXX (12 chiffres) ou 241XXXXXXXX (11 chiffres)
              <div
                ref={arrowRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"
              />
            </div>
          </FloatingPortal>
        )}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => onInputChange('telephone', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+241 XX XXX XXX ou 0XX XXX XXX"
          />
        </div>
        {fieldErrors.telephone && <p className="text-red-500 text-sm">{fieldErrors.telephone}</p>}
      </div>

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