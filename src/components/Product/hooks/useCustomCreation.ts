import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { creationService, CreationOptionItem } from '@/services';
import { CreationSize, CreationOptions as ApiCreationOptions } from '@/types';

export type Size = 'moyen' | 'maxi';

export interface LocalCreationOptions {
  size: Size;
  fruits: string[];
  sauces: string[];
  cereales: string[];
  quantity: number;
}

export interface CreationConfig {
  price: number;
  maxFruits: number;
  maxSauces: number;
  description: string;
}

export function useCustomCreation(isOpen: boolean) {
  const { dispatch } = useApp();
  const [creation, setCreation] = useState<LocalCreationOptions>({
    size: 'moyen',
    fruits: [],
    sauces: [],
    cereales: [],
    quantity: 1
  });

  const [creationSizes, setCreationSizes] = useState<CreationSize[]>([]);
  const [creationOptions, setCreationOptions] = useState<ApiCreationOptions | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sizesResp, optionsResp] = await Promise.all([
          creationService.getCreationSizes(),
          creationService.getCreationOptions()
        ]);
        setCreationSizes((sizesResp.data ?? sizesResp ?? []) as CreationSize[]);
        
        // Transformer les objets CreationOptionItem[] en string[] pour les composants
        // Filtrer uniquement les options disponibles (disponible !== false)
        const optionsData = optionsResp.data as { fruits: CreationOptionItem[]; sauces: CreationOptionItem[]; cereales: CreationOptionItem[] } | null;
        if (optionsData) {
          setCreationOptions({
            fruits: optionsData.fruits
              .filter(f => f.disponible !== false)
              .map(f => f.nom)
              .filter((nom, index, arr) => arr.indexOf(nom) === index), // Supprimer les doublons
            sauces: optionsData.sauces
              .filter(s => s.disponible !== false)
              .map(s => s.nom)
              .filter((nom, index, arr) => arr.indexOf(nom) === index), // Supprimer les doublons
            cereales: optionsData.cereales
              .filter(c => c.disponible !== false)
              .map(c => c.nom)
              .filter((nom, index, arr) => arr.indexOf(nom) === index) // Supprimer les doublons
          });
        } else {
          setCreationOptions(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de création:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const currentSize = creationSizes.find(size => size.nom === creation.size);
  const config: CreationConfig | null = currentSize ? {
    price: currentSize.prix,
    maxFruits: currentSize.maxFruits,
    maxSauces: currentSize.maxSauces,
    description: `${currentSize.maxFruits} fruit${currentSize.maxFruits > 1 ? 's' : ''} + ${currentSize.maxSauces} sauce${currentSize.maxSauces > 1 ? 's' : ''} + céréales`
  } : null;

  const toggleFruit = (fruit: string) => {
    if (!config) return;
    setCreation(prev => {
      const newFruits = prev.fruits.includes(fruit)
        ? prev.fruits.filter(f => f !== fruit)
        : prev.fruits.length < config.maxFruits
        ? [...prev.fruits, fruit]
        : prev.fruits;
      return { ...prev, fruits: newFruits };
    });
  };

  const toggleSauce = (sauce: string) => {
    if (!config) return;
    setCreation(prev => {
      const newSauces = prev.sauces.includes(sauce)
        ? prev.sauces.filter(s => s !== sauce)
        : prev.sauces.length < config.maxSauces
        ? [...prev.sauces, sauce]
        : prev.sauces;
      return { ...prev, sauces: newSauces };
    });
  };

  const toggleCereale = (cereale: string) => {
    setCreation(prev => ({
      ...prev,
      cereales: prev.cereales.includes(cereale) ? [] : [cereale]
    }));
  };

  const updateQuantity = (delta: number) => {
    setCreation(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const setSize = (size: Size) => {
    setCreation(prev => ({
      ...prev,
      size,
      fruits: [],
      sauces: []
    }));
  };

  const resetCreation = () => {
    setCreation({
      size: 'moyen',
      fruits: [],
      sauces: [],
      cereales: [],
      quantity: 1
    });
  };

  const isValid = creation.fruits.length > 0 || creation.sauces.length > 0 || creation.cereales.length > 0;

  return {
    creation,
    creationSizes,
    creationOptions,
    loading,
    config,
    toggleFruit,
    toggleSauce,
    toggleCereale,
    updateQuantity,
    setSize,
    resetCreation,
    isValid,
    dispatch
  };
}