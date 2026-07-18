import React, { useCallback, useEffect, useState } from 'react';
import { Gift, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { specialServicesService } from '@/services';
import { SpecialService } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

/**
 * Gestion des services spéciaux (Panier gourmand, Boîte pancake) :
 * - activer/désactiver un service (ex : pancake selon les humeurs)
 * - configurer le minimum d'éléments (panier : composants, pancake : pièces)
 * - gérer les composants sélectionnables du panier
 * Les prix ne se gèrent pas ici : ils sont communiqués par le vendeur après commande.
 */
export function ServicesTab() {
  const [services, setServices] = useState<SpecialService[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [minValues, setMinValues] = useState<Record<number, number>>({});
  const [newComponent, setNewComponent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const response = await specialServicesService.getAll();
      const data = (response.data as SpecialService[]) ?? [];
      setServices(data);
      setMinValues(Object.fromEntries(data.map((s) => [s.id, s.minElements])));
    } catch (e) {
      console.error('Erreur lors du chargement des services:', e);
      setError('Impossible de charger les services. Vérifiez que la migration a été appliquée.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggleActive = async (service: SpecialService) => {
    setSavingId(service.id);
    try {
      await specialServicesService.update(service.id, { actif: !service.active });
      await reload();
    } catch (e) {
      console.error('Erreur lors du changement de statut:', e);
    } finally {
      setSavingId(null);
    }
  };

  const saveMinElements = async (service: SpecialService) => {
    const value = minValues[service.id];
    if (!Number.isInteger(value) || value < 1) return;
    setSavingId(service.id);
    try {
      await specialServicesService.update(service.id, { minElements: value });
      await reload();
    } catch (e) {
      console.error('Erreur lors de la mise à jour du minimum:', e);
    } finally {
      setSavingId(null);
    }
  };

  const addComponent = async (service: SpecialService) => {
    if (!newComponent.trim()) return;
    setSavingId(service.id);
    try {
      await specialServicesService.addComponent(service.id, newComponent.trim());
      setNewComponent('');
      await reload();
    } catch (e) {
      console.error("Erreur lors de l'ajout du composant:", e);
    } finally {
      setSavingId(null);
    }
  };

  const toggleComponent = async (componentId: number, disponible: boolean) => {
    try {
      await specialServicesService.updateComponent(componentId, { disponible });
      await reload();
    } catch (e) {
      console.error('Erreur lors de la mise à jour du composant:', e);
    }
  };

  const deleteComponent = async (componentId: number) => {
    try {
      await specialServicesService.deleteComponent(componentId);
      await reload();
    } catch (e) {
      console.error('Erreur lors de la suppression du composant:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" aria-hidden="true" />
        Chargement des services…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-lg p-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Gift className="h-6 w-6 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-bold">Services spéciaux</h2>
          <p className="text-sm text-muted-foreground">
            Panier gourmand et boîte pancake — prix communiqués par vos soins après commande.
          </p>
        </div>
      </div>

      {services.map((service) => (
        <div key={service.id} className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  service.active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                )}
              >
                {service.active ? 'Actif' : 'Désactivé'}
              </span>
              <Switch
                checked={service.active}
                disabled={savingId === service.id}
                onCheckedChange={() => toggleActive(service)}
                aria-label={`${service.active ? 'Désactiver' : 'Activer'} le service ${service.name}`}
              />
            </div>
          </div>

          {/* Minimum d'éléments configurable */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor={`min-${service.id}`}>
                Minimum d'éléments ({service.code === 'panier' ? 'composants du panier' : 'pancakes par boîte'})
              </Label>
              <Input
                id={`min-${service.id}`}
                type="number"
                min={1}
                className="w-32"
                value={minValues[service.id] ?? service.minElements}
                onChange={(e) =>
                  setMinValues((prev) => ({ ...prev, [service.id]: parseInt(e.target.value, 10) || 1 }))
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={savingId === service.id || minValues[service.id] === service.minElements}
              onClick={() => saveMinElements(service)}
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>

          {/* Composants proposés aux clients */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="font-medium">Composants proposés aux clients</h4>
              <div className="space-y-2">
                {service.components.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center justify-between gap-2 p-2 border border-border rounded-lg"
                  >
                    <span className={cn('text-sm', !component.available && 'text-muted-foreground line-through')}>
                      {component.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={component.available}
                        onCheckedChange={(checked) => toggleComponent(component.id, checked)}
                        aria-label={`${component.available ? 'Rendre indisponible' : 'Rendre disponible'} ${component.name}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteComponent(component.id)}
                        aria-label={`Supprimer le composant ${component.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              {service.components.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun composant — ajoutez-en pour que les clients puissent faire leur choix.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={newComponent}
                onChange={(e) => setNewComponent(e.target.value)}
                placeholder="Nouveau composant (ex : Chocolats)"
                onKeyDown={(e) => e.key === 'Enter' && addComponent(service)}
              />
              <Button onClick={() => addComponent(service)} disabled={!newComponent.trim() || savingId === service.id}>
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Aucun service configuré. Exécutez le script d'initialisation :
          <code className="block mt-2 text-sm">cd back && npx tsx scripts/setup-services-and-images.ts</code>
        </div>
      )}
    </div>
  );
}
