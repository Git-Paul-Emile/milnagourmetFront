import { useEffect, useState } from 'react';
import { CreationOptions } from '../../types';
import { creationService, CreationOptionItem } from '../../services/creationService';

interface CreationOptionsWithIds {
  fruits: CreationOptionItem[];
  sauces: CreationOptionItem[];
  cereales: CreationOptionItem[];
}

export function useCreationOptions(displaySuccessToast?: (message: string) => void) {
  const [creationOptions, setCreationOptions] = useState<CreationOptions>({
    fruits: [],
    sauces: [],
    cereales: []
  });
  const [optionsWithIds, setOptionsWithIds] = useState<CreationOptionsWithIds>({
    fruits: [],
    sauces: [],
    cereales: []
  });
  const [fruitsModal, setFruitsModal] = useState(false);
  const [saucesModal, setSaucesModal] = useState(false);
  const [cerealesModal, setCerealesModal] = useState(false);

  const syncOptions = (data: CreationOptionsWithIds) => {
    setOptionsWithIds(data);
    setCreationOptions({
      fruits: data.fruits.map(f => f.nom),
      sauces: data.sauces.map(s => s.nom),
      cereales: data.cereales.map(c => c.nom)
    });
  };

  const loadCreationOptions = async () => {
    try {
      const resp = await creationService.getCreationOptions();
      syncOptions(resp.data);
    } catch (error) {
      console.error('Erreur lors du chargement des options de création', error);
    }
  };

  useEffect(() => {
    loadCreationOptions();
  }, []);

  const handleBulkAddFruits = (newFruits: string[]) => {
    Promise.all(newFruits.map(nom => creationService.createFruit(nom)))
      .then(responses => {
        const created = responses.map(r => (r as any).data as CreationOptionItem);
        const data = {
          ...optionsWithIds,
          fruits: [...optionsWithIds.fruits, ...created]
        };
        syncOptions(data);
        if (created.length > 0) displaySuccessToast?.('Fruits ajoutés avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de l’ajout des fruits', err);
        alert('Erreur lors de l’ajout des fruits');
      });
  };

  const handleBulkAddSauces = (newSauces: string[]) => {
    Promise.all(newSauces.map(nom => creationService.createSauce(nom)))
      .then(responses => {
        const created = responses.map(r => (r as any).data as CreationOptionItem);
        const data = {
          ...optionsWithIds,
          sauces: [...optionsWithIds.sauces, ...created]
        };
        syncOptions(data);
        if (created.length > 0) displaySuccessToast?.('Sauces ajoutées avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de l’ajout des sauces', err);
        alert('Erreur lors de l’ajout des sauces');
      });
  };

  const handleBulkAddCereales = (newCereales: string[]) => {
    Promise.all(newCereales.map(nom => creationService.createCereale(nom)))
      .then(responses => {
        const created = responses.map(r => (r as any).data as CreationOptionItem);
        const data = {
          ...optionsWithIds,
          cereales: [...optionsWithIds.cereales, ...created]
        };
        syncOptions(data);
        if (created.length > 0) displaySuccessToast?.('Céréales ajoutées avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de l’ajout des céréales', err);
        alert('Erreur lors de l’ajout des céréales');
      });
  };

  const handleRemoveFruit = (fruit: string) => {
    const target = optionsWithIds.fruits.find(f => f.nom === fruit);
    if (!target) return;
    creationService.deleteFruit(target.id)
      .then(() => {
        const data = {
          ...optionsWithIds,
          fruits: optionsWithIds.fruits.filter(f => f.id !== target.id)
        };
        syncOptions(data);
        displaySuccessToast?.(`Fruit "${fruit}" supprimé avec succès`);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression du fruit', err);
        alert('Erreur lors de la suppression du fruit');
      });
  };

  const handleRemoveSauce = (sauce: string) => {
    const target = optionsWithIds.sauces.find(s => s.nom === sauce);
    if (!target) return;
    creationService.deleteSauce(target.id)
      .then(() => {
        const data = {
          ...optionsWithIds,
          sauces: optionsWithIds.sauces.filter(s => s.id !== target.id)
        };
        syncOptions(data);
        displaySuccessToast?.(`Sauce "${sauce}" supprimée avec succès`);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression de la sauce', err);
        alert('Erreur lors de la suppression de la sauce');
      });
  };

  const handleRemoveCereale = (cereale: string) => {
    const target = optionsWithIds.cereales.find(c => c.nom === cereale);
    if (!target) return;
    creationService.deleteCereale(target.id)
      .then(() => {
        const data = {
          ...optionsWithIds,
          cereales: optionsWithIds.cereales.filter(c => c.id !== target.id)
        };
        syncOptions(data);
        displaySuccessToast?.(`Céréale "${cereale}" supprimée avec succès`);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression de la céréale', err);
        alert('Erreur lors de la suppression de la céréale');
      });
  };

  const handleEditFruit = (oldFruit: string, newFruit: string) => {
    const target = optionsWithIds.fruits.find(f => f.nom === oldFruit);
    if (!target) return;
    creationService.updateFruit(target.id, newFruit)
      .then(resp => {
        const updated = resp.data as CreationOptionItem;
        const data = {
          ...optionsWithIds,
          fruits: optionsWithIds.fruits.map(f => f.id === target.id ? updated : f)
        };
        syncOptions(data);
        displaySuccessToast?.('Fruit modifié avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de la modification du fruit', err);
        alert('Erreur lors de la modification du fruit');
      });
  };

  const handleEditSauce = (oldSauce: string, newSauce: string) => {
    const target = optionsWithIds.sauces.find(s => s.nom === oldSauce);
    if (!target) return;
    creationService.updateSauce(target.id, newSauce)
      .then(resp => {
        const updated = resp.data as CreationOptionItem;
        const data = {
          ...optionsWithIds,
          sauces: optionsWithIds.sauces.map(s => s.id === target.id ? updated : s)
        };
        syncOptions(data);
        displaySuccessToast?.('Sauce modifiée avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de la modification de la sauce', err);
        alert('Erreur lors de la modification de la sauce');
      });
  };

  const handleEditCereale = (oldCereale: string, newCereale: string) => {
    const target = optionsWithIds.cereales.find(c => c.nom === oldCereale);
    if (!target) return;
    creationService.updateCereale(target.id, newCereale)
      .then(resp => {
        const updated = resp.data as CreationOptionItem;
        const data = {
          ...optionsWithIds,
          cereales: optionsWithIds.cereales.map(c => c.id === target.id ? updated : c)
        };
        syncOptions(data);
        displaySuccessToast?.('Céréale modifiée avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de la modification de la céréale', err);
        alert('Erreur lors de la modification de la céréale');
      });
  };

  return {
    creationOptions,
    setCreationOptions,
    fruitsModal,
    setFruitsModal,
    saucesModal,
    setSaucesModal,
    cerealesModal,
    setCerealesModal,
    handleBulkAddFruits,
    handleBulkAddSauces,
    handleBulkAddCereales,
    handleRemoveFruit,
    handleRemoveSauce,
    handleRemoveCereale,
    handleEditFruit,
    handleEditSauce,
    handleEditCereale
  };
}