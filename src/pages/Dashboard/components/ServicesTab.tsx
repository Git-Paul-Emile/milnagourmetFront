import React, { useCallback, useEffect, useState } from 'react';
import { Gift, Plus, Trash2, Save, Loader2, ImagePlus } from 'lucide-react';
import { specialServicesService } from '@/services';
import { SpecialService } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

/**
 * Gestion des services spéciaux (paniers et boîtes) :
 * - activer / désactiver un service ;
 * - configurer le minimum d'éléments et le prix de départ ;
 * - gérer les composants : disponibilité, "par défaut", quantité de départ.
 */
const TYPE_LABELS: Record<string, string> = {
  PANIER_FIXE: 'Panier à composition fixe',
  PANIER_PERSO: 'Panier personnalisable',
  MONO_SAVEUR: 'Boîte mono-saveur (quantité min.)',
  ASSORTIMENT: 'Assortiment (quantité par élément)',
};

export function ServicesTab() {
  const [services, setServices] = useState<SpecialService[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [minValues, setMinValues] = useState<Record<number, number>>({});
  const [priceValues, setPriceValues] = useState<Record<number, number>>({});
  const [qtyValues, setQtyValues] = useState<Record<number, number>>({});
  const [newComponent, setNewComponent] = useState('');
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const response = await specialServicesService.getAll();
      const data = (response.data as SpecialService[]) ?? [];
      setServices(data);
      setMinValues(Object.fromEntries(data.map((s) => [s.id, s.minElements])));
      setPriceValues(Object.fromEntries(data.map((s) => [s.id, s.basePrice])));
      setQtyValues(
        Object.fromEntries(data.flatMap((s) => s.components.map((c) => [c.id, c.defaultQuantity])))
      );
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

  const savePrixBase = async (service: SpecialService) => {
    const value = priceValues[service.id];
    if (!Number.isInteger(value) || value < 0) return;
    setSavingId(service.id);
    try {
      await specialServicesService.update(service.id, { prixBase: value });
      await reload();
    } catch (e) {
      console.error('Erreur lors de la mise à jour du prix:', e);
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

  const updateComponent = async (
    componentId: number,
    data: { disponible?: boolean; parDefaut?: boolean; quantiteDefaut?: number }
  ) => {
    try {
      await specialServicesService.updateComponent(componentId, data);
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

  // Upload de l'image de couverture d'un service, puis rattachement au service.
  const handleCoverUpload = async (service: SpecialService, file: File) => {
    setUploadingKey(`cover-${service.id}`);
    try {
      const url = await specialServicesService.uploadCoverImage(file);
      await specialServicesService.update(service.id, { image: url });
      await reload();
    } catch (e) {
      console.error('Erreur lors de l\'upload de la couverture:', e);
    } finally {
      setUploadingKey(null);
    }
  };

  // Upload de l'image d'un composant, puis rattachement au composant.
  const handleComponentImageUpload = async (componentId: number, file: File) => {
    setUploadingKey(`comp-${componentId}`);
    try {
      const url = await specialServicesService.uploadComponentImage(file);
      await specialServicesService.updateComponent(componentId, { image: url });
      await reload();
    } catch (e) {
      console.error('Erreur lors de l\'upload de l\'image du composant:', e);
    } finally {
      setUploadingKey(null);
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
            Paniers et boîtes gourmandes — composition, quantités et prix de départ.
          </p>
        </div>
      </div>

      {services.map((service) => {
        const isAssortiment = service.serviceType === 'ASSORTIMENT';
        return (
          <div key={service.id} className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Image de couverture de la carte service */}
                <label
                  className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center cursor-pointer"
                  title="Changer l'image de couverture"
                >
                  {service.image ? (
                    <img src={service.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    {uploadingKey === `cover-${service.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleCoverUpload(service, f);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <span className="mt-1 inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[service.serviceType] ?? service.serviceType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-1 rounded-full',
                    service.active ? 'bg-secondary/15 text-secondary' : 'bg-muted text-muted-foreground'
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prix de départ */}
              <div className="flex items-end gap-2">
                <div className="space-y-1">
                  <Label htmlFor={`price-${service.id}`}>Prix de départ (FCFA — 0 = sur devis)</Label>
                  <Input
                    id={`price-${service.id}`}
                    type="number"
                    min={0}
                    step={500}
                    className="w-40"
                    value={priceValues[service.id] ?? service.basePrice}
                    onChange={(e) =>
                      setPriceValues((p) => ({ ...p, [service.id]: parseInt(e.target.value, 10) || 0 }))
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={savingId === service.id || priceValues[service.id] === service.basePrice}
                  onClick={() => savePrixBase(service)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>

              {/* Minimum d'éléments */}
              <div className="flex items-end gap-2">
                <div className="space-y-1">
                  <Label htmlFor={`min-${service.id}`}>Minimum d'éléments / pièces</Label>
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
                </Button>
              </div>
            </div>

            {/* Composants */}
            <div className="space-y-3 pt-2 border-t border-border">
              <h4 className="font-medium">Composants proposés aux clients</h4>
              <div className="space-y-2">
                {service.components.map((component) => (
                  <div
                    key={component.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-2.5 border border-border rounded-lg"
                  >
                    <span className="flex items-center gap-2.5">
                      {/* Image du composant (upload) */}
                      <label
                        className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-white flex items-center justify-center cursor-pointer"
                        title="Changer l'image de l'élément"
                      >
                        {component.image ? (
                          <img src={component.image} alt="" className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          {uploadingKey === `comp-${component.id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <ImagePlus className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleComponentImageUpload(component.id, f);
                            e.currentTarget.value = '';
                          }}
                        />
                      </label>
                      <span className={cn('text-sm', !component.available && 'text-muted-foreground line-through')}>
                        {component.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-4">
                      {/* Par défaut (paniers) */}
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Par défaut
                        <Switch
                          checked={component.isDefault}
                          onCheckedChange={(checked) => updateComponent(component.id, { parDefaut: checked })}
                          aria-label={`${component.isDefault ? 'Retirer des' : 'Mettre en'} éléments par défaut : ${component.name}`}
                        />
                      </label>

                      {/* Quantité de départ (assortiment) */}
                      {isAssortiment && (
                        <div className="flex items-center gap-1">
                          <Label htmlFor={`qty-${component.id}`} className="text-xs text-muted-foreground">
                            Qté départ
                          </Label>
                          <Input
                            id={`qty-${component.id}`}
                            type="number"
                            min={0}
                            className="w-16 h-8"
                            value={qtyValues[component.id] ?? component.defaultQuantity}
                            onChange={(e) =>
                              setQtyValues((q) => ({ ...q, [component.id]: parseInt(e.target.value, 10) || 0 }))
                            }
                            onBlur={() => {
                              const v = qtyValues[component.id] ?? component.defaultQuantity;
                              if (v !== component.defaultQuantity) updateComponent(component.id, { quantiteDefaut: v });
                            }}
                          />
                        </div>
                      )}

                      {/* Disponibilité */}
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Dispo
                        <Switch
                          checked={component.available}
                          onCheckedChange={(checked) => updateComponent(component.id, { disponible: checked })}
                          aria-label={`${component.available ? 'Rendre indisponible' : 'Rendre disponible'} ${component.name}`}
                        />
                      </label>

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
        );
      })}

      {services.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Aucun service configuré. Lancez le seed :
          <code className="block mt-2 text-sm">cd back && npm run seed</code>
        </div>
      )}
    </div>
  );
}
