import { Palette } from 'lucide-react';
import { useThemeManagement } from './hooks/useThemeManagement';
import { CreateThemeForm } from './components/CreateThemeForm';
import { EditThemeModal } from './components/EditThemeModal';
import { ThemeCard } from './components/ThemeCard';

interface ThemeSectionProps {
  displaySuccessToast: (message: string) => void;
}

export function ThemeSection({ displaySuccessToast }: ThemeSectionProps) {
  const {
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
    activatingThemeId,
    handleSetActiveTheme,
    handleCreateTheme,
    handleDeleteTheme,
    handleEditTheme,
    handleStartEdit,
    handleCancelEdit
  } = useThemeManagement(displaySuccessToast);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <span>Gestion des Thèmes</span>
        </h3>
      </div>

      {isCreating && (
        <CreateThemeForm
          newThemeName={newThemeName}
          setNewThemeName={setNewThemeName}
          newThemeDescription={newThemeDescription}
          setNewThemeDescription={setNewThemeDescription}
          onCancel={() => {
            setIsCreating(false);
            setNewThemeName('');
            setNewThemeDescription('');
          }}
          onCreate={handleCreateTheme}
        />
      )}

      {editingTheme && (
        <EditThemeModal
          editThemeName={editThemeName}
          setEditThemeName={setEditThemeName}
          editThemeDescription={editThemeDescription}
          setEditThemeDescription={setEditThemeDescription}
          editLightColors={editLightColors}
          setEditLightColors={setEditLightColors}
          onCancel={handleCancelEdit}
          onSave={handleEditTheme}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActivating={activatingThemeId === theme.id}
            onSetActive={handleSetActiveTheme}
            onEdit={handleStartEdit}
            onDelete={handleDeleteTheme}
          />
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
