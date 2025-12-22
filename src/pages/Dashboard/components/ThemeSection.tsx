import React, { useState } from 'react';
import { Palette, Check, Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { themeService, Theme, ThemeColors } from '@/services/themeService';
import { Modal } from '@/components/Modal';

interface ThemeSectionProps {
  displaySuccessToast: (message: string) => void;
}

export function ThemeSection({ displaySuccessToast }: ThemeSectionProps) {
  const { themes, theme: activeTheme, setActiveTheme, refreshThemes } = useTheme();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeDescription, setNewThemeDescription] = useState('');
  const [editThemeName, setEditThemeName] = useState('');
  const [editThemeDescription, setEditThemeDescription] = useState('');
  const [editLightColors, setEditLightColors] = useState<ThemeColors>({});
  const [editDarkColors, setEditDarkColors] = useState<ThemeColors>({});

  // Fonctions utilitaires pour convertir HSL <-> Hex
  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map((val, index) => {
      if (index === 0) return parseFloat(val);
      return parseFloat(val.replace('%', '')) / 100;
    });

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleSetActiveTheme = async (themeId: number) => {
    try {
      await setActiveTheme(themeId);
      displaySuccessToast('Thème activé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation du thème:', error);
      // TODO: Afficher un message d'erreur
    }
  };

  const handleCreateTheme = async () => {
    if (!newThemeName.trim()) return;

    try {
      // Créer un thème basé sur le thème actif actuel
      const baseColors = activeTheme?.lightColors || {};

      await themeService.createTheme({
        name: newThemeName.trim(),
        description: newThemeDescription.trim() || undefined,
        lightColors: baseColors,
        darkColors: activeTheme?.darkColors
      });

      setNewThemeName('');
      setNewThemeDescription('');
      setIsCreating(false);
      refreshThemes();
      displaySuccessToast('Thème créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du thème:', error);
      // TODO: Afficher un message d'erreur
    }
  };

  const handleDeleteTheme = async (themeId: number, themeName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le thème "${themeName}" ?`)) {
      return;
    }

    try {
      await themeService.deleteTheme(themeId);
      refreshThemes();
      displaySuccessToast('Thème supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du thème:', error);
      // TODO: Afficher un message d'erreur
    }
  };

  const handleEditTheme = async () => {
    if (!editingTheme || !editThemeName.trim()) return;

    try {
      await themeService.updateTheme(editingTheme.id, {
        name: editThemeName.trim(),
        description: editThemeDescription.trim() || undefined,
        lightColors: editLightColors,
        darkColors: editDarkColors,
      });

      setEditingTheme(null);
      setEditThemeName('');
      setEditThemeDescription('');
      setEditLightColors({});
      setEditDarkColors({});
      refreshThemes();
      displaySuccessToast('Thème modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification du thème:', error);
      // TODO: Afficher un message d'erreur
    }
  };

  const handleStartEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setEditThemeName(theme.name);
    setEditThemeDescription(theme.description || '');
    setEditLightColors(theme.lightColors || {});
    setEditDarkColors(theme.darkColors || {});
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
    setEditThemeName('');
    setEditThemeDescription('');
    setEditLightColors({});
    setEditDarkColors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <span>Gestion des Thèmes</span>
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau thème</span>
        </button>
      </div>

      {/* Formulaire de création */}
      {isCreating && (
        <div className="bg-card p-4 rounded-lg border space-y-4">
          <h4 className="font-medium">Créer un nouveau thème</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du thème</label>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Thème Été"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
              <input
                type="text"
                value={newThemeDescription}
                onChange={(e) => setNewThemeDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description du thème"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsCreating(false);
                setNewThemeName('');
                setNewThemeDescription('');
              }}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateTheme}
              disabled={!newThemeName.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingTheme && (
        <Modal
          isOpen={!!editingTheme}
          onClose={handleCancelEdit}
        >
          <div className="bg-card p-6 rounded-lg border max-w-lg w-full space-y-4">
            <h3 className="text-lg font-semibold">Modifier le thème</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Nom du thème</label>
              <input
                type="text"
                value={editThemeName}
                onChange={(e) => setEditThemeName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Thème Été"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
              <input
                type="text"
                value={editThemeDescription}
                onChange={(e) => setEditThemeDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description du thème"
              />
            </div>

            {/* Section couleurs */}
            <div className="space-y-3">
              <h4 className="text-md font-medium">Personnaliser les couleurs</h4>
              <p className="text-sm text-muted-foreground">Cliquez sur les cercles colorés pour changer les couleurs principales du thème</p>
              <div className="flex items-center justify-center space-x-8 py-4">
                <div className="text-center space-y-2">
                  <label className="block text-sm font-medium">Couleur principale</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={editLightColors.primary ? hslToHex(editLightColors.primary) : '#2cb67d'}
                      onChange={(e) => setEditLightColors(prev => ({
                        ...prev,
                        primary: hexToHsl(e.target.value)
                      }))}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer appearance-none"
                      style={{ backgroundColor: editLightColors.primary ? `hsl(${editLightColors.primary})` : '#2cb67d' }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300 pointer-events-none"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <label className="block text-sm font-medium">Couleur secondaire</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={editLightColors.secondary ? hslToHex(editLightColors.secondary) : '#ff9f43'}
                      onChange={(e) => setEditLightColors(prev => ({
                        ...prev,
                        secondary: hexToHsl(e.target.value)
                      }))}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer appearance-none"
                      style={{ backgroundColor: editLightColors.secondary ? `hsl(${editLightColors.secondary})` : '#ff9f43' }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300 pointer-events-none"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <label className="block text-sm font-medium">Couleur d'accent</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={editLightColors.accent ? hslToHex(editLightColors.accent) : '#2cb67d'}
                      onChange={(e) => setEditLightColors(prev => ({
                        ...prev,
                        accent: hexToHsl(e.target.value)
                      }))}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer appearance-none"
                      style={{ backgroundColor: editLightColors.accent ? `hsl(${editLightColors.accent})` : '#2cb67d' }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEditTheme}
                disabled={!editThemeName.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Modifier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Liste des thèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
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

              {/* Aperçu des couleurs */}
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

              {/* Actions */}
              <div className="flex justify-between items-center">
                {!theme.isActive && (
                  <button
                    onClick={() => handleSetActiveTheme(theme.id)}
                    className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                  >
                    Activer
                  </button>
                )}
                {theme.isActive && (
                  <span className="text-sm text-primary font-medium">Actif</span>
                )}

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleStartEdit(theme)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {!theme.isDefault && (
                    <button
                      onClick={() => handleDeleteTheme(theme.id, theme.name)}
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
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun thème trouvé</p>
        </div>
      )}
    </div>
  );
}