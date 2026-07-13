import { Check, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Theme } from '@/services/themeService';

interface ThemeCardProps {
  theme: Theme;
  isActivating: boolean;
  onSetActive: (themeId: number) => void;
  onEdit: (theme: Theme) => void;
  onDelete: (themeId: number, themeName: string) => void;
}

export function ThemeCard({ theme, isActivating, onSetActive, onEdit, onDelete }: ThemeCardProps) {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all ${
        theme.isActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {theme.isActive && (
        <div className="absolute top-2 right-2">
          <Check className="h-5 w-5 text-primary" />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h4 className="font-medium flex items-center space-x-2">
            <span>{theme.name}</span>
            {theme.isDefault && (
              <span className="text-xs bg-muted px-2 py-1 rounded">Par défaut</span>
            )}
          </h4>
          {theme.description && (
            <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: `hsl(${theme.lightColors.primary})` }}
            title="Couleur primaire"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: `hsl(${theme.lightColors.secondary})` }}
            title="Couleur secondaire"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: `hsl(${theme.lightColors.accent})` }}
            title="Couleur d'accent"
          />
        </div>

        <div className="flex justify-between items-center">
          {!theme.isActive && (
            <Button onClick={() => onSetActive(theme.id)} loading={isActivating} size="sm">
              Activer
            </Button>
          )}
          {theme.isActive && (
            <span className="text-sm text-primary font-medium">Actif</span>
          )}

          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(theme)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </button>
            {!theme.isDefault && (
              <button
                onClick={() => onDelete(theme.id, theme.name)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
