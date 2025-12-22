import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeContext } from './ThemeContextDefinition';
import { themeService, Theme } from '@/services/themeService';
import { useAuth } from '@/hooks/useAuth';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  // Appliquer les variables CSS du thème
  const applyTheme = useCallback((selectedTheme: Theme) => {
    const root = document.documentElement;

    // Appliquer les couleurs du mode clair
    if (selectedTheme.lightColors) {
      Object.entries(selectedTheme.lightColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // TODO: Gérer le mode sombre si nécessaire
    // if (selectedTheme.darkColors && isDarkMode) {
    //   Object.entries(selectedTheme.darkColors).forEach(([key, value]) => {
    //     root.style.setProperty(`--${key}`, value);
    //   });
    // }

    setTheme(selectedTheme);
  }, []);

  // Charger le thème actif
  const loadActiveTheme = useCallback(async () => {
    try {
      const activeTheme = await themeService.getActiveTheme();
      applyTheme(activeTheme);
    } catch (error) {
      console.error('Erreur lors du chargement du thème actif:', error);
      setError('Erreur lors du chargement du thème');
    }
  }, [applyTheme]);

  // Charger tous les thèmes (uniquement pour les admins)
  const loadThemes = useCallback(async () => {
    if (!isAdmin) {
      setThemes([]);
      return;
    }

    try {
      const allThemes = await themeService.getAllThemes();
      setThemes(allThemes);
    } catch (error) {
      console.error('Erreur lors du chargement des thèmes:', error);
      setError('Erreur lors du chargement des thèmes');
    }
  }, [isAdmin]);

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadActiveTheme(), loadThemes()]);
    } catch (error) {
      console.error('Erreur lors du chargement des données de thème:', error);
    } finally {
      setLoading(false);
    }
  }, [loadActiveTheme, loadThemes]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey, isAdmin]);

  // Rafraîchir les thèmes
  const refreshThemes = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Changer le thème actif
  const setActiveTheme = async (themeId: number) => {
    try {
      const result = await themeService.setActiveTheme(themeId);
      applyTheme(result.theme);
      refreshThemes(); // Rafraîchir la liste pour mettre à jour les statuts
    } catch (error) {
      console.error('Erreur lors du changement de thème:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themes,
      loading,
      error,
      applyTheme,
      refreshThemes,
      setActiveTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}