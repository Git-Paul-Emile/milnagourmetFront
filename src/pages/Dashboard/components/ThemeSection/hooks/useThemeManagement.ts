import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/contexts/useApp';
import { themeService, Theme, ThemeColors } from '@/services/themeService';

export function useThemeManagement(displaySuccessToast: (message: string) => void) {
  const { themes, theme: activeTheme, setActiveTheme, refreshThemes } = useTheme();
  const { dispatch } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeDescription, setNewThemeDescription] = useState('');
  const [editThemeName, setEditThemeName] = useState('');
  const [editThemeDescription, setEditThemeDescription] = useState('');
  const [editLightColors, setEditLightColors] = useState<ThemeColors>({});
  const [editDarkColors, setEditDarkColors] = useState<ThemeColors>({});
  const [activatingThemeId, setActivatingThemeId] = useState<number | null>(null);

  const displayErrorToast = (message: string) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: { id: Date.now().toString(), type: 'error', message }
    });
  };

  const handleSetActiveTheme = async (themeId: number) => {
    setActivatingThemeId(themeId);
    try {
      await setActiveTheme(themeId);
      displaySuccessToast('Thème activé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation du thème:', error);
      displayErrorToast('Erreur lors de l\'activation du thème');
    } finally {
      setActivatingThemeId(null);
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
      displayErrorToast('Erreur lors de la création du thème');
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
      displayErrorToast('Erreur lors de la suppression du thème');
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
      displayErrorToast('Erreur lors de la modification du thème');
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

  return {
    themes,
    isCreating,
    setIsCreating,
    editingTheme,
    newThemeName,
    setNewThemeName,
    newThemeDescription,
    setNewThemeDescription,
    editThemeName,
    setEditThemeName,
    editThemeDescription,
    setEditThemeDescription,
    editLightColors,
    setEditLightColors,
    editDarkColors,
    activatingThemeId,
    handleSetActiveTheme,
    handleCreateTheme,
    handleDeleteTheme,
    handleEditTheme,
    handleStartEdit,
    handleCancelEdit
  };
}
