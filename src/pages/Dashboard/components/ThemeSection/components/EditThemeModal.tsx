import { Modal } from '@/components/Modal';
import { ThemeColors } from '@/services/themeService';
import { hslToHex, hexToHsl } from '../utils/colorConversion';

interface EditThemeModalProps {
  editThemeName: string;
  setEditThemeName: (value: string) => void;
  editThemeDescription: string;
  setEditThemeDescription: (value: string) => void;
  editLightColors: ThemeColors;
  setEditLightColors: (updater: (prev: ThemeColors) => ThemeColors) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EditThemeModal({
  editThemeName,
  setEditThemeName,
  editThemeDescription,
  setEditThemeDescription,
  editLightColors,
  setEditLightColors,
  onCancel,
  onSave
}: EditThemeModalProps) {
  const colorFields: Array<{ key: 'primary' | 'secondary' | 'accent'; label: string; fallback: string }> = [
    { key: 'primary', label: 'Couleur principale', fallback: '#2cb67d' },
    { key: 'secondary', label: 'Couleur secondaire', fallback: '#ff9f43' },
    { key: 'accent', label: "Couleur d'accent", fallback: '#2cb67d' }
  ];

  return (
    <Modal isOpen onClose={onCancel}>
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

        <div className="space-y-3">
          <h4 className="text-md font-medium">Personnaliser les couleurs</h4>
          <p className="text-sm text-muted-foreground">Cliquez sur les cercles colorés pour changer les couleurs principales du thème</p>
          <div className="flex items-center justify-center space-x-8 py-4">
            {colorFields.map(({ key, label, fallback }) => {
              const hslValue = editLightColors[key];
              const bg = hslValue ? `hsl(${hslValue})` : fallback;
              return (
                <div key={key} className="text-center space-y-2">
                  <label className="block text-sm font-medium">{label}</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={hslValue ? hslToHex(hslValue) : fallback}
                      onChange={(e) => setEditLightColors(prev => ({
                        ...prev,
                        [key]: hexToHsl(e.target.value)
                      }))}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer appearance-none"
                      style={{ backgroundColor: bg }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300 pointer-events-none"></div>
                  </div>
                </div>
              );
            })}
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
            onClick={onSave}
            disabled={!editThemeName.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Modifier
          </button>
        </div>
      </div>
    </Modal>
  );
}
