interface CreateThemeFormProps {
  newThemeName: string;
  setNewThemeName: (value: string) => void;
  newThemeDescription: string;
  setNewThemeDescription: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
}

export function CreateThemeForm({
  newThemeName,
  setNewThemeName,
  newThemeDescription,
  setNewThemeDescription,
  onCancel,
  onCreate
}: CreateThemeFormProps) {
  return (
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
          onClick={onCancel}
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onCreate}
          disabled={!newThemeName.trim()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Créer
        </button>
      </div>
    </div>
  );
}
