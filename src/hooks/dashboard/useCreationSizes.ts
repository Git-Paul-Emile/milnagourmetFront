import { useState, useEffect } from 'react';
import { CreationSize } from '../../types';
import { creationService } from '../../services/creationService';
import { ApiResponse } from '../../services/httpClient';

export function useCreationSizes(displaySuccessToast?: (message: string) => void) {
  const [creationSizes, setCreationSizes] = useState<CreationSize[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addSizeModal, setAddSizeModal] = useState(false);
  const [editingSize, setEditingSize] = useState<CreationSize | null>(null);
  const [newSize, setNewSize] = useState<Partial<CreationSize>>({
    nom: '',
    prix: 0,
    maxFruits: 1,
    maxSauces: 1,
    cerealesAutorise: true
  });

  // Charger les tailles depuis l'API
  const loadCreationSizes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creationService.getCreationSizes();
      const sizes = (response as ApiResponse<CreationSize[]>).data || [];
      setCreationSizes(sizes);
    } catch (err) {
      console.error('Erreur lors du chargement des tailles:', err);
      setError('Erreur lors du chargement des tailles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreationSizes();
  }, []);

  const handleAddSize = async (sizeData: Partial<CreationSize>) => {
    if (!sizeData.nom || sizeData.prix === undefined) {
      alert('Veuillez saisir un nom et un prix pour la taille');
      return;
    }

    try {
      setLoading(true);
      const response = await creationService.createCreationSize(sizeData);
      const newSize = (response as ApiResponse<CreationSize>).data!;
      setCreationSizes(prev => [...prev, newSize]);

      // Afficher le toast de succès
      displaySuccessToast?.(`Taille "${newSize.nom}" créée avec succès`);

      setNewSize({
        nom: '',
        prix: 0,
        maxFruits: 1,
        maxSauces: 1,
        cerealesAutorise: true
      });
      setAddSizeModal(false);
    } catch (err: unknown) {
      console.error('Erreur lors de la création de la taille:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la taille';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSize = (size: CreationSize) => {
    setEditingSize(size);
  };

  const handleSaveSize = async (sizeData: Partial<CreationSize>) => {
    if (!editingSize) return;

    try {
      setLoading(true);
      const response = await creationService.updateCreationSize(editingSize.id, sizeData);
      const updatedSize = (response as ApiResponse<CreationSize>).data!;
      setCreationSizes(prev => prev.map(s => s.id === editingSize.id ? updatedSize : s));

      // Afficher le toast de succès
      displaySuccessToast?.(`Taille "${updatedSize.nom}" modifiée avec succès`);

      setEditingSize(null);
    } catch (err: unknown) {
      console.error('Erreur lors de la mise à jour de la taille:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la taille';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async (sizeName: string) => {
    const sizeToDelete = creationSizes.find(s => s.nom === sizeName);
    if (!sizeToDelete) return;

    try {
      setLoading(true);
      await creationService.deleteCreationSize(sizeToDelete.id);
      setCreationSizes(prev => prev.filter(s => s.id !== sizeToDelete.id));

      // Afficher le toast de succès
      displaySuccessToast?.(`Taille "${sizeName}" supprimée avec succès`);
    } catch (err: unknown) {
      console.error('Erreur lors de la suppression de la taille:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la taille';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    creationSizes,
    setCreationSizes,
    loading,
    error,
    addSizeModal,
    setAddSizeModal,
    editingSize,
    setEditingSize,
    newSize,
    setNewSize,
    handleAddSize,
    handleEditSize,
    handleSaveSize,
    handleDeleteSize,
    loadCreationSizes
  };
}